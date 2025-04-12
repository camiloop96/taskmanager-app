#!/bin/bash

# 👉 Configuración
DROPLET_USER=root
DROPLET_IP=157.245.239.121          
KEY_PATH=~/.ssh/id_rsa             
IMAGE_NAME=taskmanager-server
IMAGE_TAG=latest
REMOTE_PATH=/root
REMOTE_PROJECT_PATH=/root/taskmanager-app

# 🚧 Build local
echo "🚧 Building Docker image..."
docker build -t $IMAGE_NAME:$IMAGE_TAG --file ../Dockerfile ..

# 🐳 Exporta la imagen
echo "📦 Exporting Docker image to tar..."
docker save $IMAGE_NAME:$IMAGE_TAG -o $IMAGE_NAME.tar

# 🚀 Copia al droplet
echo "📤 Copying image to Droplet..."
scp -i $KEY_PATH $IMAGE_NAME.tar $DROPLET_USER@$DROPLET_IP:$REMOTE_PATH

# 🔐 SSH para cargar la imagen y levantar contenedores
echo "🔁 Deploying on Droplet..."
ssh -i $KEY_PATH $DROPLET_USER@$DROPLET_IP << EOF
  docker load -i $REMOTE_PATH/$IMAGE_NAME.tar
  cd $REMOTE_PROJECT_PATH
  git pull origin master
  docker compose down
  docker compose up -d
EOF

# ✅ Limpieza local
echo "🔁 Deleting image..."
rm $IMAGE_NAME.tar

echo "🎉 Deploy complete!"
