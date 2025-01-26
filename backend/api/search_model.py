import json
import nltk
import spacy
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import re

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

# Ensure necessary NLTK data is downloaded
nltk.download("stopwords")
nltk.download("punkt")
nltk.download("wordnet")


# Define your cleaning and lemmatization functions
def clean_text(text):
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    text = re.sub(r'@\w+', '', text)
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'[0-9]', '', text)
    text = re.sub(r'\s{2,}', ' ', text).strip()
    return text

def lemmatize_text_spacy(text):
    doc = nlp(text)
    return " ".join([token.lemma_ for token in doc if token.text not in stopwords.words('english')])

def vectorize_text(docs):
    vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1, 2), min_df=0.002, max_df=0.99, max_features=10000, stop_words="english")
    X = vectorizer.fit_transform(docs)
    return X, vectorizer

def search_model(query, docs):
    cleaned_docs = [clean_text(doc) for doc in docs]
    lemmatized_docs = [lemmatize_text_spacy(doc) for doc in cleaned_docs]

    X, vectorizer = vectorize_text(lemmatized_docs)
    query_vec = vectorizer.transform([lemmatize_text_spacy(query)])

    similarities = []
    for i in range(len(docs)):
        sim = np.dot(X[i].toarray(), query_vec.T.toarray()) / (np.linalg.norm(X[i].toarray()) * np.linalg.norm(query_vec.T.toarray()))
        similarities.append((i, sim))

    sorted_similarities = sorted(similarities, key=lambda x: x[1], reverse=True)
    return sorted_similarities

def handler(request):
    data = request.json
    query = data.get('query')
    docs = data.get('docs')

    if not query or not docs:
        return json.dumps({"error": "Query and documents are required!"}), 400

    results = search_model(query, docs)
    return json.dumps({"results": results})

