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


RUN pip install --no-cache-dir -r /app/Hate_Speech/requirements.txt && \
    pip install --no-cache-dir -r /app/Click-Bait/requirements.txt && \
    pip install --no-cache-dir -r /app/Security-Header/requirements.txt && \
    pip install --no-cache-dir -r /app/SSL/requirements.txt
# Copy both applications' code into the container
COPY server/Hate_Speech /app/Hate_Speech
COPY server/Click-Bait /app/Click-Bait
COPY server/Security-Header /app/Security-Header
COPY server/SSL /app/SSL

# Copy supervisor configuration file
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Expose ports for both servers
EXPOSE 5001 5002 5003 5004

# Start the supervisor daemon
CMD ["/usr/bin/supervisord"]

#  docker build -t myapp .
# $ docker run -d   -p 5001:5001   -p 5002:5002   -p 5003:5003   -p 5004:5004   --name myapp-container   myapp