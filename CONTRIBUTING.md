# Contributing to Social Street Smart

Thank you for your interest in contributing to Social Street Smart! This document provides detailed information on how to set up the project, run various components, and contribute effectively.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setting Up the Project](#setting-up-the-project)
3. [Running the Components](#running-the-components)
4. [Contributing Guidelines](#contributing-guidelines)
5. [Code Style](#code-style)
6. [Reporting Issues](#reporting-issues)

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
├── ml-models/              # Machine learning models
│   ├── clickbait/
│   ├── hate-speech/
│   └── fake-news/
└── docker-compose.yml
```

## Setting Up the Project

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Docker and Docker Compose

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
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

### Backend Setup

The backend services are containerized using Docker:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Start all services:
   ```bash
   docker-compose up --build
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
