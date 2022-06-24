# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.234.0/containers/typescript-node/.devcontainer/base.Dockerfile
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

RUN apt-get update && apt-get install -y --no-install-recommends curl
RUN npm install -g ts-node nodemon