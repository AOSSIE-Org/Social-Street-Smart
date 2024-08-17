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

RUN pip install --no-cache-dir -r /app/Hate_Speech/requirements.txt && \
    pip install --no-cache-dir -r /app/Click-Bait/requirements.txt

# Copy both applications' code into the container
COPY server/Hate_Speech /app/Hate_Speech
COPY server/Click-Bait /app/Click-Bait

# Copy supervisor configuration file
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Expose ports for both servers
EXPOSE 5001 5002

# Start the supervisor daemon
CMD ["/usr/bin/supervisord"]
