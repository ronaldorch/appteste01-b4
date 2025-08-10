#!/bin/bash

# 🚀 QUICK DEPLOY - Deploy rápido do GreenLeaf Cannabis Marketplace
# Para atualizações rápidas sem reinstalar tudo

echo "🌿 ======================================="
echo "🚀 GREENLEAF - QUICK DEPLOY"
echo "🌿 ======================================="

PROJECT_DIR="/var/www/azure-site"
LOG_FILE="/var/log/greenleaf-deploy.log"

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Iniciando quick deploy"

# Ir para diretório do projeto
cd "$PROJECT_DIR" || exit 1

echo "1️⃣ Fazendo git pull..."
git stash push -m "Auto-stash before quick deploy $(date)" 2>/dev/null || true
git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || echo "⚠️ Git pull falhou"

echo "2️⃣ Instalando dependências..."
npm install

echo "3️⃣ Fazendo build..."
npm run build

echo "4️⃣ Reiniciando aplicação..."
pm2 restart greenleaf-market

echo "5️⃣ Testando aplicação..."
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Aplicação funcionando!"
else
    echo "❌ Erro na aplicação - verificando logs..."
    pm2 logs greenleaf-market --lines 10
fi

PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo ""
echo "🎉 Deploy concluído!"
echo "🌐 Acesse: http://$PUBLIC_IP"

log "✅ Quick deploy concluído"
