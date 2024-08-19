# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install supervisor and other necessary dependencies
RUN apt-get update && \
    apt-get install -y supervisor && \
    apt-get clean

# Copy all applications' requirements.txt and install dependencies
COPY Hate_Speech/requirements.txt /app/Hate_Speech/requirements.txt
COPY Click-Bait/requirements.txt /app/Click-Bait/requirements.txt
COPY Security-Header/requirements.txt /app/Security-Header/requirements.txt
COPY SSL/requirements.txt /app/SSL/requirements.txt
COPY FakeNewsAPI/requirements.txt /app/FakeNewsAPI/requirements.txt
COPY ImageAPI/requirements.txt /app/ImageAPI/requirements.txt
COPY News_Origin/requirements.txt /app/News_Origin/requirements.txt
COPY ReportAPI/requirements.txt /app/ReportAPI/requirements.txt

RUN pip install --no-cache-dir -r /app/Hate_Speech/requirements.txt && \
    pip install --no-cache-dir -r /app/Click-Bait/requirements.txt && \
    pip install --no-cache-dir -r /app/Security-Header/requirements.txt && \
    pip install --no-cache-dir -r /app/SSL/requirements.txt && \
    pip install --no-cache-dir -r /app/FakeNewsAPI/requirements.txt && \
    pip install --no-cache-dir -r /app/ImageAPI/requirements.txt && \
    pip install --no-cache-dir -r /app/News_Origin/requirements.txt && \
    pip install --no-cache-dir -r /app/ReportAPI/requirements.txt

# Copy all applications' code into the container
COPY Hate_Speech /app/Hate_Speech
COPY Click-Bait /app/Click-Bait
COPY Security-Header /app/Security-Header
COPY SSL /app/SSL
COPY FakeNewsAPI /app/FakeNewsAPI
COPY ImageAPI /app/ImageAPI
COPY News_Origin /app/News_Origin
COPY ReportAPI /app/ReportAPI

# Copy supervisor configuration file
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Expose ports for all services
EXPOSE 5001 5002 5003 5004 5005 5006 5007 5008

# Start the supervisor daemon
CMD ["/usr/bin/supervisord"]
