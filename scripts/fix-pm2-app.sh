#!/bin/bash

# 🚀 SCRIPT DE CORREÇÃO - PM2 E APLICAÇÃO
# Corrige problemas do PM2 e reinicia a aplicação

echo "🚀 Corrigindo PM2 e aplicação..."
echo "================================"

cd /var/www/azure-site || exit 1

# Parar todos os processos PM2
echo "🛑 Parando processos PM2..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Verificar se o arquivo ecosystem.config.js existe
if [ ! -f "ecosystem.config.js" ]; then
    echo "📝 Criando ecosystem.config.js..."
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'azure-site',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/azure-site',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: '/var/log/pm2/azure-site.log',
    out_file: '/var/log/pm2/azure-site-out.log',
    error_file: '/var/log/pm2/azure-site-error.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
}
EOF
fi

# Criar diretório de logs se não existir
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Iniciar aplicação com PM2
echo "🚀 Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js

# Aguardar alguns segundos
sleep 5

# Verificar status
echo "📊 Status da aplicação:"
pm2 status

# Salvar configuração PM2
pm2 save

echo "✅ PM2 configurado e aplicação iniciada!"
