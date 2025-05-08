#!/bin/bash

set -e  # stop on error

# === CONFIGURATION ===
REGISTRY="docker.io"                             # Ou registry.gitlab.com, etc.
USERNAME="kinfack"                        # Ton nom Docker Hub ou GitLab
IMAGE_NAME="playwright-ci"
IMAGE_TAG="${1:-latest}"                         # Si aucun tag passé => latest

FULL_IMAGE="${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "🔧 Construction de l'image Docker : $FULL_IMAGE"

# === BUILD ===
docker build -t "$FULL_IMAGE" .

echo "🚀 Push vers le registre distant..."
docker push "$FULL_IMAGE"

echo "✅ Image buildée et poussée avec succès : $FULL_IMAGE"
