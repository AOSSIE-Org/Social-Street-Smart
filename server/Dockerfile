# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install necessary dependencies
RUN apt-get update && apt-get install -y curl && apt-get clean

# Copy and install all necessary requirements
COPY Hate_Speech/requirements.txt /app/Hate_Speech/requirements.txt
COPY Click-Bait/requirements.txt /app/Click-Bait/requirements.txt
COPY Security-Header/requirements.txt /app/Security-Header/requirements.txt
COPY SSL/requirements.txt /app/SSL/requirements.txt
COPY fakeNews/newsScrapper/requirements.txt /app/fakeNews/newsScrapper/requirements.txt
COPY fakeNews/predictions/requirements.txt /app/fakeNews/predictions/requirements.txt
COPY imageAPI/requirements.txt /app/imageAPI/requirements.txt
COPY ReportAPI/requirements.txt /app/ReportAPI/requirements.txt
COPY Summarizer/requirements.txt /app/Summarizer/requirements.txt

RUN pip install --no-cache-dir -r /app/Hate_Speech/requirements.txt && \
    pip install --no-cache-dir -r /app/Click-Bait/requirements.txt && \
    pip install --no-cache-dir -r /app/Security-Header/requirements.txt && \
    pip install --no-cache-dir -r /app/SSL/requirements.txt && \
    pip install --no-cache-dir -r /app/fakeNews/newsScrapper/requirements.txt && \
    pip install --no-cache-dir -r /app/fakeNews/predictions/requirements.txt && \
    pip install --no-cache-dir -r /app/imageAPI/requirements.txt && \
    pip install --no-cache-dir -r /app/ReportAPI/requirements.txt && \
    pip install --no-cache-dir -r /app/Summarizer/requirements.txt

# Copy all applications' code into the container
COPY Hate_Speech /app/Hate_Speech
COPY Click-Bait /app/Click-Bait
COPY Security-Header /app/Security-Header
COPY SSL /app/SSL
COPY fakeNews /app/fakeNews/newsScrapper
COPY fakeNews /app/fakeNews/predictions
COPY imageAPI /app/imageAPI
COPY ReportAPI /app/ReportAPI
COPY Summarizer /app/Summarizer

# Expose ports for Flask services
EXPOSE 5001 5002 5003 5004 5005 5006 5007 5008

# Default command is to start the app (can be overridden by Docker Compose)
CMD ["python", "app.py"]
