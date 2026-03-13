# Contributing to Social Street Smart

Thank you for your interest in contributing to Social Street Smart! This document provides detailed information on how to set up the project, run various components, and contribute effectively.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setting Up the Project](#setting-up-the-project)

3. [Extracting Data and Models](#extracting-data-and-models)
4. [Running the Components](#running-the-components)
5. [Contributing Guidelines](#contributing-guidelines)
6. [Code Style](#code-style)
7. [Reporting Issues](#reporting-issues)



## Project Structure

```
Social-Street-Smart/
├── client/
├── NewClient/              # Frontend (Chrome extension)
├── server/                 # Backend services
│   ├── clickbait/
│   ├── hate-speech/
│   ├── fakenews/
│   ├── imageAPI/
│   └── news-origin/
├── ML/              # Machine learning models
│   ├── clickbait/
│   ├── hate-speech/
│   └── fakenews/

└── docker-compose.yml
```

## Setting Up the Project

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Docker and Docker Compose

### Frontend Setup

1. Navigate to the NewClient directory:
   ```bash
   cd NewClient
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder


#### Deployed Docker Images on Render

  - DockerHub : https://hub.docker.com/repository/docker/vishav9933

  - Click bait Api : https://sss-click-bait-latest.onrender.com/
  - Ssl Api : https://sss-ssl-latest.onrender.com/
  - Hate speech Api: https://sss-hate-speech-latest.onrender.com/
  - FakeNews Api - https://social-street-smart-latest.onrender.com/


### Backend Setup

The backend services are containerized using Docker:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Start all services:
   ```bash

   docker compose up
   ```

## Extracting Data and Models

Some data and models are too large to be included in the GitHub repository. Follow these steps to obtain and set up the necessary files:

### Fake News Model

1. Download the Fake News datasets from Kaggle: [AOSSIE Fake News Detection Datasets](https://www.kaggle.com/ad6398/aossie-fake-news-detection-datasets)
2. Extract and place the files in `server/fakeNewsAPI/ML/` and `server/fakeNews/predictions/ML/`
3. Download the GloVe word embeddings (glove.6B.100d.txt) from [Stanford NLP](https://nlp.stanford.edu/projects/glove/) and place it in both directories mentioned above

### Click-Bait Model

1. Download the Click-Bait dataset from Kaggle: [AOSSIE Click-Bait Dataset](https://www.kaggle.com/ad6398/aossie-click-bait-dataset)
2. Extract and place the files in the appropriate directory under `ML/clickbait/`

### Google News Vectors

1. Download the Google News vector dataset from Kaggle: [Google News Vectors](https://www.kaggle.com/datasets/adarshsng/googlenewsvectors)
2. Extract and place the files in the appropriate directory under `ML/`

### Toxic Comment/Hate Speech Models

1. Download the GloVe word embeddings (glove.6B.zip) from [Stanford NLP](https://nlp.stanford.edu/data/glove.6B.zip)
2. Extract and place the files in `Toxic Comment/Data/glove.6B/`
3. Download the Toxic Comment Classification Challenge dataset from Kaggle: [Jigsaw Toxic Comment Classification Challenge](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data)
4. Extract and place the files in `Toxic Comment/Data/toxic-comment/`

### Image API Credentials

1. Follow the instructions in this video to generate Google App Credentials: [Generate Google App Credentials](https://youtu.be/1Oz5TfwvhfQ)
2. Save the generated JSON file as `GoogleAppCreds.json` in `server/imageAPI/tmp/`

### News Origin API Key

1. Go to [Google Custom Search API](https://developers.google.com/custom-search/v1/introduction)
2. Click on "Get a Key" and follow the instructions to create a new project and generate an API key
3. Create a `.env` file in `server/News_Origin/` and add your API key:
   ```
   GOOGLE_API_KEY=your_api_key_here

   ```

## Running the Components

### Frontend (Chrome Extension)

After building the extension, you can load it into Chrome as an unpacked extension. Any changes to the source code will require rebuilding the extension and reloading it in Chrome.

### Backend Servers

The Docker Compose file will start all the backend services. You can access them at the following endpoints:

- Clickbait API: `http://localhost:5000/predict`
- Hate Speech API: `http://localhost:5001/predict`
- Fake News API: `http://localhost:5002/predict`
- Image Disinformation API: `http://localhost:5003/analyze`
- News Origin API: `http://localhost:5004/origin`

## Contributing Guidelines

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests (if available)
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Code Style

- For Python: Follow PEP 8
- For JavaScript/TypeScript: Use ESLint with the project's configuration

## Reporting Issues

Use the GitHub Issues tab to report bugs or suggest enhancements. Please provide as much detail as possible, including:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Any relevant logs or screenshots

Thank you for contributing to Social Street Smart!
