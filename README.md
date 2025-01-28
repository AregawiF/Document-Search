# DocSearch

**DocSearch** is a web-based search system designed to simplify the process of finding information across various document types and text sources. Instead of manually searching through notebooks or individual files, DocSearch provides a powerful and efficient way to retrieve relevant results with ranked accuracy.

## 🚀 Live Demo

Explore the live system here: [DocSearch Live Website](https://documentsearch-ten.vercel.app/)

## 🧠 Model Overview

### Natural Language Processing and Vectorization

The system uses a custom NLP pipeline, which includes:
1. **Text Cleaning**: The input documents and queries are cleaned by removing non-ASCII characters, special characters, numbers, and extra whitespaces.
2. **Lemmatization**: Words are lemmatized using spaCy, with a custom lemmatization approach for specific terms (e.g., "ethiopian" -> "ethiopia").
3. **Stopwords Removal**: A custom list of stopwords is used to filter out unimportant words from the text.
4. **TF-IDF Vectorization**: The cleaned and lemmatized text is transformed into numerical vectors using the Term Frequency-Inverse Document Frequency (TF-IDF) method. This allows the system to assess the importance of words in the context of the documents.

### Similarity Measurement

After vectorizing the text, the system calculates the cosine similarity between the query and each document. This helps rank the documents by relevance. The top `k` most similar documents are returned as search results.

### Web Scraping

If a URL is provided, the system can extract text from the website's `<p>` (paragraph) tags to use as documents for searching.

## 📋 Features

- **Input Search Queries**: Users can easily enter search terms or questions.
- **Multi-Source Search**: Retrieve results from:
  - PDFs
  - Word Documents
  - Websites
  - Pasted Text
- **Relevance Ranking**: Results are displayed in a ranked list based on similarity to the search query.
- **Adjustable Results**: Users can set the number of top results to view.
- **Similarity Score**: Each result includes a similarity score to help evaluate its relevance.

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind deployed on [Vercel](https://vercel.com/)
- **Backend**: Python Flask, deployed on [Render](https://render.com/)

