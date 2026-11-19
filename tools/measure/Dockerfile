FROM node:22-bookworm
ARG CLAUDE_VERSION=latest
RUN apt-get update && apt-get install -y --no-install-recommends git jq golang-go ripgrep && rm -rf /var/lib/apt/lists/*
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_VERSION}
USER node
WORKDIR /work
RUN git config --global user.name measure && git config --global user.email measure@example.invalid && git config --global --add safe.directory '*'
