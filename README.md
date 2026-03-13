
<img src="https://lh3.googleusercontent.com/WpVNZgHSiAVrU-DV1qfUU0rL5YFe_ibyfEG5oFpmqPHfkJ5xpnnuuXU6d_OqQZxTr2F-laJdyA4NLPZLnvBX5Cq6Dg=s1280-w1280-h800" alt="SOCIAL-STREET-SMART" width="300" style="display: block; margin: 0 auto;">


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
- Content Summarization
- News Origin Detection

## Quick Start

### Frontend (Chrome Extension)

```bash
cd Newclient
npm install
npm run build

```
### Load the 'dist' folder as an unpacked extension in Chrome


### Backend Servers

```bash
cd server
docker compose up --build
````

## Project Structure

```
Social-Street-Smart/
├── Newclient/                 # Frontend (Chrome extension)
├── server/                 # Backend services
│   ├── clickbait/
│   ├── hate-speech/
│   ├── fake-news/
│   ├── image-api/
│   ├── report-api/
│   ├── summarize-api/
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
- Report API: `http://localhost:5006/report`
- Summarize API: `http://localhost:5005/summarize`

## Contributing

We welcome contributions to Social Street Smart! For detailed setup instructions and how to contribute, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the CC-By-NC-ND 4.0 License - see the [LICENSE](LICENSE) file for details.

[![License](https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-nd/4.0/)

## Acknowledgements

- [AOSSIE](https://aossie.gitlab.io/) for organizing and supporting this project
- All contributors and mentors who have helped shape Social Street Smart

<img src="https://avatars.githubusercontent.com/u/38881995?v=4"  width="155" style="display: block; margin: 0 auto;">