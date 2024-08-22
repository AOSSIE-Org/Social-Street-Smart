# Use an official Python runtime as a parent image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy all necessary files into the container at /app
COPY . /app

# Install the necessary packages using the unified requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Install any additional system dependencies
RUN apt-get update && apt-get install -y curl

# Set the working directory for newsScrapper and run the script
WORKDIR /app/newsScrapper
RUN python app.py

# Set the working directory for predictions
WORKDIR /app/predictions

# Expose the port for the predictions service
EXPOSE 5005

# Define environment variables for Flask in predictions
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Start the Flask application
CMD ["python", "app.py", "--host=0.0.0.0/5005"]

# Note: The curl command would typically be run after the container starts
# You can include it in a separate script or run it manually after the container is up and running
