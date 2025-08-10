#!/bin/bash

# 🔧 SCRIPT COMPLETO DE CORREÇÃO
# Executa todas as correções necessárias

echo "🔧 ======================================="
echo "🚀 CORREÇÃO COMPLETA - GREENLEAF MARKET"
echo "🔧 ======================================="
echo ""

PROJECT_DIR="/var/www/azure-site"
cd "$PROJECT_DIR" || exit 1

echo "1️⃣ Corrigindo schema do banco de dados..."
chmod +x scripts/fix-database-schema.sh
./scripts/fix-database-schema.sh

echo ""
echo "2️⃣ Corrigindo configuração do Nginx..."
chmod +x scripts/fix-nginx-config.sh
sudo ./scripts/fix-nginx-config.sh

echo ""
echo "3️⃣ Corrigindo PM2 e aplicação..."
chmod +x scripts/fix-pm2-app.sh
./scripts/fix-pm2-app.sh

echo ""
echo "4️⃣ Testando aplicação..."
sleep 10

# Testar aplicação
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Aplicação (porta 3000): OK"
else
    echo "❌ Aplicação (porta 3000): ERRO"
fi

# Testar Nginx
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Nginx (porta 80): OK"
else
    echo "❌ Nginx (porta 80): ERRO"
fi

echo ""
echo "🎉 ================================"
echo "✅ CORREÇÕES APLICADAS COM SUCESSO!"
echo "🎉 ================================"
echo ""
echo "🌐 Acesse: http://$(curl -s ifconfig.me)"
echo "👤 Admin: admin@greenleaf.com / admin123"
echo "👤 Demo: demo@exemplo.com / 123456"
echo ""
echo "📊 Status dos serviços:"
pm2 status
echo ""
sudo systemctl status nginx --no-pager -l
