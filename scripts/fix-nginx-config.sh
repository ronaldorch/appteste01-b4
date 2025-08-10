#!/bin/bash

# 🌐 SCRIPT DE CORREÇÃO - CONFIGURAÇÃO NGINX
# Corrige problemas na configuração do Nginx

echo "🌐 Corrigindo configuração do Nginx..."
echo "====================================="

# Obter IP público
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "localhost")

echo "🔧 Criando configuração corrigida do Nginx..."

# Criar configuração corrigida do Nginx
sudo tee /etc/nginx/sites-available/greenleaf-market > /dev/null << EOF
server {
    listen 80;
    server_name $PUBLIC_IP localhost _;

    # Logs
    access_log /var/log/nginx/greenleaf.access.log;
    error_log /var/log/nginx/greenleaf.error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "GreenLeaf Market OK";
        add_header Content-Type text/plain;
    }

    # Static files
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site e remover default
sudo ln -sf /etc/nginx/sites-available/greenleaf-market /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração
echo "🔍 Testando configuração do Nginx..."
if sudo nginx -t; then
    echo "✅ Configuração do Nginx válida!"
    
    # Reiniciar Nginx
    echo "🔄 Reiniciando Nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo "✅ Nginx configurado e reiniciado com sucesso!"
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi
