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

```bash
cd client
npm install
npm run build

```
### Load the 'dist' folder as an unpacked extension in Chrome

## Fixing EACCES Errors on MacOS
If you encounter an EACCES error while running npm install, it may be due to permission issues. Try one of the following:

Quick Fix (Not Recommended):
```bash
sudo npm install
Using sudo may cause future permission issues.
```

Recommended Fix:
Change the ownership of node_modules and ~/.npm directory:
```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules
```
Then retry npm install.

Best Practice: Use nvm to manage Node.js versions and avoid permission issues.

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
source ~/.bashrc # or ~/.zshrc if using zsh
nvm install node
nvm use node
npm install
```

### Backend Servers

```bash
cd server
docker compose up
````

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
