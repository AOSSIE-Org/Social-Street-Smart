FROM node:12.16.1
ENV mode production
WORKDIR /usr/src/app
RUN \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y \
      google-chrome-stable \
      xvfb \
  && rm -rf /var/lib/apt/lists/*