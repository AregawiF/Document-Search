import nltk
import pandas as pd
import numpy as np
import re
import string
import spacy
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
import requests
from bs4 import BeautifulSoup
from io import StringIO
from PyPDF2 import PdfReader
from docx import Document


nltk.download("stopwords")
nltk.download("punkt_tab")
nltk.download('wordnet')

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")


stopwords_list = stopwords.words('english')
english_stopset = set(stopwords.words('english')).union(
                  {"things", "that's", "something", "take", "don't", "may", "want", "you're",
                   "set", "might", "says", "including", "lot", "much", "said", "know",
                   "good", "step", "often", "going", "thing", "things", "think",
                   "back", "actually", "better", "look", "find", "right", "example",
                                                                  "verb", "verbs"})


def clean_text(text):
    if not text:
        return ""

    text = re.sub(r'[^\x00-\x7F]+', ' ', text)      # Remove non-ASCII characters
    text = re.sub(r'@\w+', '', text)                # Remove email mentions, user handles, etc.
    text = text.lower()                             # Lowercase text
    text = re.sub(r'[^\w\s]', ' ', text)            # Remove punctuation
    text = re.sub(r'[0-9]', '', text)               # Remove numbers
    text = re.sub(r'\s{2,}', ' ', text).strip()     # Remove extra spaces

    return text


def vectorize_text(docs):
    vectorizer = TfidfVectorizer(
        analyzer='word', 
        ngram_range=(1, 2), 
        min_df=0.002, 
        max_df=0.99, 
        max_features=10000, 
        lowercase=True, 
        stop_words=list(english_stopset))
    X = vectorizer.fit_transform(docs)
    return X, vectorizer


def custom_lemmatize(word):
    # Dictionary of custom word transformations
    custom_lemmas = {
        'ethiopian': 'ethiopia',
        'ethiopia': 'ethiopia',}
    return custom_lemmas.get(word.lower(), word)

def lemmatize_text_spacy(text):
    doc = nlp(text)
    # Lemmatize each token and return the lemmatized text
    lemmatized_text = " ".join([custom_lemmatize(token.lemma_) for token in doc if token.text not in english_stopset])
    return lemmatized_text


def get_similar_articles(q, df, vectorizer, k, query, docs):
    q = [q]
    q_vec = vectorizer.transform(q).toarray().reshape(df.shape[0],)
    sim = {}

    for i in range(len(docs)):
        sim[i] = np.dot(df.loc[:, i].values, q_vec) / np.linalg.norm(df.loc[:, i]) * np.linalg.norm(q_vec)  

    sim_sorted = sorted(sim.items(),key=lambda x : x[1], reverse=True)[:min(len(sim), k)]

    return sim_sorted


def search(query, docs, k):
    cleaned_docs = [clean_text(doc) for doc in docs]
    lemmatized_docs = [lemmatize_text_spacy(doc) for doc in cleaned_docs]
    
    X, vectorizer = vectorize_text(lemmatized_docs)


    df = pd.DataFrame(X.T.toarray())


    q = lemmatize_text_spacy(query)


    return get_similar_articles(q, df, vectorizer, k, query, docs)
