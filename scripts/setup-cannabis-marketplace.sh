#!/bin/bash

echo "🌿 Configurando GreenLeaf Market - Cannabis Marketplace..."
echo "======================================================"

cd /var/www/azure-site

# 1. Verificar se o banco está configurado
if [ ! -f ".env.local" ]; then
    echo "❌ Configure o banco primeiro com: ./scripts/setup-database-connection.sh"
    exit 1
fi

# 2. Carregar variáveis
export $(grep -v '^#' .env.local | xargs)

# 3. Executar script de tabelas do marketplace
echo "🗄️ Criando tabelas do marketplace..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/marketplace-tables.sql

if [ $? -eq 0 ]; then
    echo "✅ Tabelas do marketplace criadas!"
else
    echo "❌ Erro ao criar tabelas!"
    exit 1
fi

# 4. Inserir produtos de cannabis
echo "🌱 Inserindo produtos de cannabis fictícios..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/cannabis-products.sql

if [ $? -eq 0 ]; then
    echo "✅ Produtos de cannabis inseridos!"
else
    echo "❌ Erro ao inserir produtos!"
    exit 1
fi

# 5. Parar aplicação
echo "🔄 Parando aplicação..."
pm2 stop azure-site

# 6. Build
echo "🏗️ Fazendo build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build!"
    exit 1
fi

# 7. Reiniciar
echo "🚀 Reiniciando aplicação..."
pm2 start azure-site
sleep 5

# 8. Teste
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")

echo ""
echo "🎉 ======================================="
echo "✅ GREENLEAF MARKET CONFIGURADO!"
echo "🎉 ======================================="
echo ""
echo "🌿 Acesse o GreenLeaf Market:"
echo "   Loja: http://$PUBLIC_IP"
echo "   Produtos: http://$PUBLIC_IP/produtos"
echo "   Dashboard: http://$PUBLIC_IP/dashboard"
echo ""
echo "📋 Credenciais:"
echo "   Email: demo@exemplo.com"
echo "   Senha: 123456"
echo ""
echo "🌱 Produtos disponíveis:"
echo "   ✅ Sementes Premium (White Widow, OG Kush, etc)"
echo "   ✅ Acessórios (Grinders, Bongs, Papéis)"
echo "   ✅ Extratos & Óleos (CBD, Hash, Rosin)"
echo "   ✅ Vaporizadores (Mighty+, Arizer, etc)"
echo "   ✅ Cultivo Indoor (LED, Grow Tent, etc)"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   🎮 Este é um marketplace FICTÍCIO"
echo "   🚫 Criado apenas para demonstração/jogos"
echo "   💻 Nenhum produto real é vendido"
echo ""
echo "🔧 Para monitorar: pm2 logs azure-site"
