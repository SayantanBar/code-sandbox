FROM ubuntu:22.04

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Create user
RUN useradd -ms /bin/bash sandbox

# Install dependencies and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Verify installation
RUN node -v && npm -v

# Set working directory
WORKDIR /home/sandbox

# Switch to sandbox user
USER sandbox

# Set up bash prompt
RUN echo "PS1='\\w \\$ '" >> ~/.bashrc

# Set up final working directory
WORKDIR /home/sandbox/app

