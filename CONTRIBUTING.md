# Social Street Smart

Social Street Smart is a Chrome extension aimed at making the internet a safer and more productive space for users. It addresses issues like abusive language, fake news, clickbait, malicious websites, and security attacks.

## Project Overview

- **Frontend**: Chrome extension built with React and TypeScript
- **Backend**: Multiple Python-based APIs for various detection tasks
- **ML Models**: Pre-trained models for clickbait, hate speech, and fake news detection

## Features

- **Clickbait Detection**: Identifies misleading headlines designed to attract attention
- **Hate Speech Detection**: Flags content with abusive or offensive language
- **Fake News Detection**: Analyzes articles for misinformation and false content
- **Disinformation in Images Detection**: Identifies manipulated or misleading images
- **Web Activity Tracking**: Monitors and reports browsing patterns
- **Website Reputation Checking**: Evaluates the credibility of websites
- **Content Summarization**: Provides concise summaries of lengthy articles
- **News Origin Detection**: Identifies the original source of news articles

## Installation Guide

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Docker and Docker Compose
- Chrome Browser

### Frontend (Chrome Extension) Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AOSSIE/Social-Street-Smart.git
   cd Social-Street-Smart
   ```

2. Navigate to the frontend directory:
   ```bash
   cd Newclient
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the extension:
   ```bash
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the `dist` folder generated in the build step
   - The extension icon should appear in your browser toolbar

### Backend Installation

#### Using Docker (Recommended)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Start all services:
   ```bash
   docker compose up --build
   ```

#### Manual Installation (For Development)

1. For each service, navigate to its directory and create a virtual environment:
   ```bash
   cd server/[service-name]
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Start each service individually (consult service-specific README for port configurations)

## Required Data and Models Setup

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
2. Extract and place the files in `server/hate-speech/`
3. Download the Toxic Comment Classification Challenge dataset from Kaggle: [Jigsaw Toxic Comment Classification Challenge](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data)
4. Extract and place the files in `server/hate-speech/data/`

### Image API Credentials

1. Follow the instructions in this video to generate Google App Credentials: [Generate Google App Credentials](https://youtu.be/1Oz5TfwvhfQ)
2. Save the generated JSON file as `GoogleAppCreds.json` in `server/imageAPI/tmp/`

### News Origin API Key

1. Go to [Google Custom Search API](https://developers.google.com/custom-search/v1/introduction)
2. Click on "Get a Key" and follow the instructions to create a new project and generate an API key
3. Create a `.env` file in `server/News_Origin/` and add your API key:
   ```
   # Environment variables
   API_KEY = os.getenv("API_KEY") # Replace with ur Key from https://developers.google.com/custom-search/v1/introduction
   CSE_ID = os.getenv("CSE_ID") # Replace with your valid CSE ID from  https://programmablesearchengine.google.com/controlpanel/all
   ```

## Project Structure

```
Social-Street-Smart/
├── Newclient/                 # Frontend (Chrome extension)
│   ├── public/                # Static files
│   ├── src/                   # Source code
│   ├── dist/                  # Built extension (generated)
│   └── package.json           # Dependencies and scripts
│
├── server/                    # Backend services
│   ├── clickbait/             # Clickbait detection service
│   ├── hate-speech/           # Hate speech detection service
│   ├── fake-news/             # Fake news detection service
│   ├── image-api/             # Image disinformation detection
│   ├── report-api/            # Reporting service
│   ├── summarize-api/         # Content summarization service
│   ├── news-origin/           # News origin detection service
│   └── docker-compose.yml     # Docker configuration
│
├── ML/                        # Machine learning models
│   ├── clickbait/             # Clickbait detection models
│   ├── hate-speech/           # Hate speech detection models
│   └── fake-news/             # Fake news detection models
│
├── docs/                      # Documentation
├── tests/                     # Test files
├── LICENSE                    # License file
└── README.md                  # This file
```

## API Endpoints

All APIs are available after starting the backend services:

- Clickbait API: `http://localhost:5000/predict`
- Hate Speech API: `http://localhost:5001/predict`
- Fake News API: `http://localhost:5002/predict`
- Image Disinformation API: `http://localhost:5003/analyze`
- News Origin API: `http://localhost:5004/origin`
- Report API: `http://localhost:5006/report`
- Summarize API: `http://localhost:5005/summarize`

## Deployed Services

The following services are deployed and available online:

- DockerHub Repository: [https://hub.docker.com/repository/docker/vishav9933](https://hub.docker.com/repository/docker/vishav9933)
- Clickbait API: [https://sss-click-bait-latest.onrender.com/](https://sss-click-bait-latest.onrender.com/)
- SSL API: [https://sss-ssl-latest.onrender.com/](https://sss-ssl-latest.onrender.com/)
- Hate Speech API: [https://sss-hate-speech-latest.onrender.com/](https://sss-hate-speech-latest.onrender.com/)
- Fake News API: [https://social-street-smart-latest.onrender.com/](https://social-street-smart-latest.onrender.com/)

## Usage Guide

1. Once the extension is installed and the backend services are running, you'll see the Social Street Smart icon in your Chrome toolbar.
2. Click on the icon to open the extension popup.
3. Navigate to any webpage to analyze its content:
   - The extension will automatically check for clickbait headlines, hate speech, and fake news.
   - For image analysis, right-click on an image and select the appropriate option from the context menu.
   - For article summarization, click the summarize button in the extension popup.

## Troubleshooting

### Common Issues

1. **APIs not responding**: Make sure Docker services are running properly. Check with `docker ps` to see if all containers are active.
2. **Extension not loading**: Verify that you've built the extension correctly and loaded the right directory in Chrome.
3. **Missing data files**: Ensure all required datasets and models are downloaded and placed in the correct directories.

### Logs

- Docker container logs: `docker logs [container_name]`
- Extension logs: Open Chrome DevTools for the extension background page

## Contributing

We welcome contributions to Social Street Smart! For detailed setup instructions and how to contribute, please see [CONTRIBUTING.md](CONTRIBUTING.md).

### Pull Request Process

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests (if available)
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Code Style

- For Python: Follow PEP 8
- For JavaScript/TypeScript: Use ESLint with the project's configuration

## License

This project is licensed under the CC-By-NC-ND 4.0 License - see the [LICENSE](LICENSE) file for details.

[![License](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)

## Acknowledgements

- [AOSSIE](https://aossie.gitlab.io/) for organizing and supporting this project
- All contributors and mentors who have helped shape Social Street Smart
- Open source community for providing valuable resources and tools

## Contact

For questions, suggestions, or support, please open an issue on the GitHub repository.