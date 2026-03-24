# Social Street Smart

Social Street Smart is a Chrome extension aimed at making the internet a safer and more productive space for users. It addresses issues like abusive language, fake news, clickbait, malicious websites, and security attacks.

## Project Overview

- **Frontend**: Chrome extension built with React and TypeScript
- **Backend**: Multiple Python-based APIs for various detection tasks
- **ML Models**: Pre-trained models for clickbait, hate speech, and fake news detection

## Features

- Clickbait detection
- Hate speech detection
- Fake news detection
- Disinformation in images detection
- Web activity tracking
- Website reputation checking

## Quick Start

### Frontend (Chrome Extension)
Follow these steps to set up the frontend locally:
1.  Navigate to the client directory:

```bash
cd client
```

2.  Install dependencies:

```bash
npm install
```

3.  Run in Development Mode:
Currently, the `npm run build` script is being updated. To test the extension, use:

```bash
npm run dev
```

4.  Load the extension in Chrome:

- Open Chrome and navigate to `chrome://extensions/`
- Enable Developer mode in the top right
- Click Load unpacked and select the `client` (or `dist` if created) folder


### Backend Servers

1.  Navigate to the server directory:
```bash
cd server

```
2.  Start services with Docker:
```bash
docker compose up

```

## Project Structure

```
Social-Street-Smart/
├── client/                 # Frontend (Chrome extension)
├── server/                 # Backend services
│   ├── clickbait/
│   ├── hate-speech/
│   ├── fake-news/
│   ├── image-api/
│   └── news-origin/
├── ML/              # Machine learning models
│   ├── clickbait/
│   ├── hate-speech/
│   └── fake-news/
└── docker-compose.yml
```

## API Endpoints

- Clickbait API: `http://localhost:5000/predict`
- Hate Speech API: `http://localhost:5001/predict`
- Fake News API: `http://localhost:5002/predict`
- Image Disinformation API: `http://localhost:5003/analyze`
- News Origin API: `http://localhost:5004/origin`

## Contributing

We welcome contributions to Social Street Smart! For detailed setup instructions and how to contribute, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the CC-By-NC-ND 4.0 License - see the [LICENSE](LICENSE) file for details.

[![License](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)

## Acknowledgements

- [AOSSIE](https://aossie.gitlab.io/) for organizing and supporting this project
- All contributors and mentors who have helped shape Social Street Smart
