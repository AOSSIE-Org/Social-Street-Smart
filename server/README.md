# Social Street Smart - Backend Services

This folder contains the backend services for the Social Street Smart project. Each service is designed to handle a specific feature of the application.

## Features and Services

### 1. **Clickbait Detection**
   - **Description**: Detects whether a given text is clickbait or not.
   - **API Endpoint**: `http://localhost:5002/predict`
   - **Setup**:
     ```bash
     cd Click-Bait
     flask run --host=0.0.0.0 --port=5002
     ```

### 2. **Hate Speech Detection**
   - **Description**: Identifies hate speech in the provided text.
   - **API Endpoint**: `http://localhost:5001/predict`
   - **Setup**:
     ```bash
     cd Hate_Speech
     flask run --host=0.0.0.0 --port=5001
     ```

### 3. **Fake News Detection**
   - **Description**: Determines whether a news article or content is fake or genuine.
   - **API Endpoint**: `http://localhost:5008/predict`
   - **Setup**:
     ```bash
     cd fakeNews/predictions
     flask run --host=0.0.0.0 --port=5008
     ```

### 4. **Image Disinformation Detection**
   - **Description**: Analyzes images for disinformation or manipulation.
   - **API Endpoint**: `http://localhost:5007/analyze`
   - **Setup**:
     ```bash
     cd imageAPI
     flask run --host=0.0.0.0 --port=5007
     ```

### 5. **News Origin Detection**
   - **Description**: Identifies the origin of a news article.
   - **API Endpoint**: `http://localhost:5009/origin`
   - **Setup**:
     ```bash
     cd News_Origin
     flask run --host=0.0.0.0 --port=5009
     ```

### 6. **Report API**
   - **Description**: Allows users to report fake or hateful content.
   - **API Endpoint**: `http://localhost:5006/report`
   - **Setup**:
     ```bash
     cd ReportAPI
     flask run --host=0.0.0.0 --port=5006
     ```

### 7. **Summarizer API**
   - **Description**: Summarizes long articles or content into concise summaries.
   - **API Endpoint**: `http://localhost:5005/summarize`
   - **Setup**:
     ```bash
     cd Summarizer
     flask run --host=0.0.0.0 --port=5005
     ```

### 8. **Security Header Checker**
   - **Description**: Scans websites for missing or weak security headers.
   - **API Endpoint**: `http://localhost:5003/shc`
   - **Setup**:
     ```bash
     cd Security-Header
     flask run --host=0.0.0.0 --port=5003
     ```

### 9. **SSL Validator**
   - **Description**: Validates SSL certificates and checks website safety.
   - **API Endpoint**: `http://localhost:5004/ssl`
   - **Setup**:
     ```bash
     cd SSL
     flask run --host=0.0.0.0 --port=5004
     ```

## Running All Services with Docker

To run all services simultaneously, use Docker Compose:
```bash
docker compose up --build
```

## Folder Structure

```
server/
├── Click-Bait/           # Clickbait detection service
├── Hate_Speech/          # Hate speech detection service
├── fakeNews/             # Fake news detection service
├── imageAPI/             # Image disinformation detection service
├── News_Origin/          # News origin detection service
├── ReportAPI/            # Reporting service
├── Summarizer/           # Summarization service
├── Security-Header/      # Security header checker
├── SSL/                  # SSL validation service
└── docker-compose.yml    # Docker Compose configuration
```

## Notes

- Each service runs independently and listens on its respective port.
- Ensure all dependencies are installed before running the services.
- Use the provided Docker Compose file to simplify the setup process.

## Contributing

Contributions are welcome! Please refer to the main [README](../README.md) for guidelines.
