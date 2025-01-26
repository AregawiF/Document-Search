from flask import Flask, request, jsonify
import nltk
import pandas as pd
import numpy as np
import re
import spacy
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer

# Import your model functions
nltk.download("stopwords")
nltk.download("punkt_tab")
nltk.download("wordnet")

# Initialize spaCy
nlp = spacy.load("en_core_web_sm")

# Custom stopwords
stopwords_list = stopwords.words('english')
english_stopset = set(stopwords.words('english')).union(
    {"things", "that's", "something", "take", "don't", "may", "want", "you're",
     "set", "might", "says", "including", "lot", "much", "said", "know", "good",
     "step", "often", "going", "thing", "things", "think", "back", "actually",
     "better", "look", "find", "right", "example", "verb", "verbs"})


def clean_text(text):
    if not text:
        return ""
    
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    text = re.sub(r'@\w+', '', text)
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'[0-9]', '', text)
    text = re.sub(r'\s{2,}', ' ', text).strip()
    return text


def custom_lemmatize(word):
    custom_lemmas = {'ethiopian': 'ethiopia', 'ethiopia': 'ethiopia'}
    return custom_lemmas.get(word.lower(), word)


def lemmatize_text_spacy(text):
    doc = nlp(text)
    return " ".join([custom_lemmatize(token.lemma_) for token in doc if token.text not in english_stopset])


def vectorize_text(docs):
    vectorizer = TfidfVectorizer(
        analyzer='word', ngram_range=(1, 2), min_df=0.002,
        max_df=0.99, max_features=10000, lowercase=True,
        stop_words=list(english_stopset)
    )
    X = vectorizer.fit_transform(docs)
    return X, vectorizer


def get_similar_articles(q, df, vectorizer, k, docs):
    q = [q]
    q_vec = vectorizer.transform(q).toarray().reshape(df.shape[0],)
    sim = {}

    for i in range(len(docs)):
        sim[i] = np.dot(df.loc[:, i].values, q_vec) / (
            np.linalg.norm(df.loc[:, i]) * np.linalg.norm(q_vec)
        )

    sim_sorted = sorted(sim.items(), key=lambda x: x[1], reverse=True)[:min(len(sim), k)]
    return sim_sorted


def search(query, docs, k):
    cleaned_docs = [clean_text(doc) for doc in docs]
    lemmatized_docs = [lemmatize_text_spacy(doc) for doc in cleaned_docs]
    X, vectorizer = vectorize_text(lemmatized_docs)
    df = pd.DataFrame(X.T.toarray())
    q = lemmatize_text_spacy(query)
    sim_sorted = get_similar_articles(q, df, vectorizer, k, docs)

    result = []
    n = 0
    for i, v in sim_sorted:
        if v != 0.0:
            result.append((docs[i], v))
            n += 1
            if n == k:
                break
    
    return result


# Initialize Flask app
app = Flask(__name__)

@app.route('/search', methods=['POST'])
def search_documents():
    try:
        # Get request data
        data = request.get_json()
        query = data.get("query", "")
        docs = data.get("docs", [])
        k = data.get("k", 5)

        if not query or not docs:
            return jsonify({"error": "Both 'query' and 'docs' are required"}), 400

        # Perform search
        response = search(query, docs, k)


        # # Format results
        # response = [{"doc_index": res[0], "score": res[1]} for res in results]

        return jsonify({"results": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)

