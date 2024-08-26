# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install supervisor
RUN apt-get update && \
    apt-get install -y supervisor && \
    apt-get clean

# Copy both applications' requirements.txt and install dependencies
COPY server/Hate_Speech/requirements.txt /app/Hate_Speech/requirements.txt
COPY server/Click-Bait/requirements.txt /app/Click-Bait/requirements.txt
COPY server/Security-Header/requirements.txt /app/Security-Header/requirements.txt
COPY server/SSL/requirements.txt /app/SSL/requirements.txt
COPY server/Summarizer/requirements.txt /app/Summarizer/requirements.txt
COPY server/ReportAPI/requirements.txt /app/ReportAPI/requirements.txt



RUN pip install --no-cache-dir -r /app/Hate_Speech/requirements.txt && \
    pip install --no-cache-dir -r /app/Click-Bait/requirements.txt && \
    pip install --no-cache-dir -r /app/Security-Header/requirements.txt && \
    pip install --no-cache-dir -r /app/SSL/requirements.txt && \
    pip install --no-cache-dir -r /app/Summarizer/requirements.txt && \
    pip install --no-cache-dir -r /app/ReportAPI/requirements.txt


# Copy both applications' code into the container
COPY server/Hate_Speech /app/Hate_Speech
COPY server/Click-Bait /app/Click-Bait
COPY server/Security-Header /app/Security-Header
COPY server/SSL /app/SSL
COPY server/Summarizer /app/Summarizer
COPY server/ReportAPI /app/ReportAPI


# Copy supervisor configuration file
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Expose ports for both servers
EXPOSE 5001 5002 5003 5004 5005 5006

# Start the supervisor daemon
CMD ["/usr/bin/supervisord"]

#  docker build -t main .
#  docker run -d --env-file server/ReportAPI/.env  -p 5001:5001 -p 5002:5002 -p 5003:5003 -p 5004:5004 -p 5005:5005 -p 5006:5006 --name instance main

# docker run -d -p 5001:5001 -p 5002:5002 -p 5003:5003 -p 5004:5004 -p 5005:5005 -p 5006:5006 --name instance main