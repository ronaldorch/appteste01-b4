#!/bin/bash

# Script para configurar conexão com banco de dados
echo "🗄️ Configurando conexão com banco de dados..."

# Solicitar informações do banco
read -p "🔗 IP da VM do banco de dados: " DB_HOST
read -p "🔢 Porta do PostgreSQL (padrão 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "📊 Nome do banco de dados: " DB_NAME
read -p "👤 Usuário do banco: " DB_USER
read -s -p "🔐 Senha do banco: " DB_PASSWORD
echo ""

# Testar conectividade
echo "🔍 Testando conectividade com a VM do banco..."
if ping -c 3 $DB_HOST > /dev/null 2>&1; then
    echo "✅ VM do banco está acessível"
else
    echo "❌ VM do banco não está acessível. Verifique a conectividade."
    exit 1
fi

# Testar conexão PostgreSQL
echo "🔍 Testando conexão PostgreSQL..."
if command -v psql > /dev/null 2>&1; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Conexão PostgreSQL estabelecida com sucesso!"
    else
        echo "❌ Erro na conexão PostgreSQL. Verifique as credenciais."
        exit 1
    fi
else
    echo "⚠️ Cliente PostgreSQL não instalado. Instalando..."
    sudo apt update
    sudo apt install -y postgresql-client
fi

# Criar arquivo .env
echo "📝 Criando arquivo de configuração..."
cd /var/www/azure-site

cat > .env.local << EOF
# Configurações do Banco de Dados
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_SSL=false

# JWT Secret (mude em produção)
JWT_SECRET=$(openssl rand -base64 32)

# Ambiente
NODE_ENV=production
EOF

# Proteger arquivo .env
chmod 600 .env.local
echo "✅ Arquivo .env.local criado e protegido"

# Instalar dependências adicionais
echo "📦 Instalando dependências do banco de dados..."
npm install pg @types/pg bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken

# Executar script SQL de setup
echo "🗄️ Configurando tabelas do banco de dados..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/database-setup.sql

if [ $? -eq 0 ]; then
    echo "✅ Tabelas criadas com sucesso!"
else
    echo "❌ Erro ao criar tabelas. Verifique o script SQL."
    exit 1
fi

# Rebuild da aplicação
echo "🏗️ Fazendo rebuild da aplicação..."
npm run build

# Reiniciar aplicação
echo "🔄 Reiniciando aplicação..."
pm2 restart azure-site

echo ""
echo "🎉 =================================="
echo "✅ INTEGRAÇÃO COM BANCO CONCLUÍDA!"
echo "🎉 =================================="
echo ""
echo "🗄️ Banco de dados: $DB_HOST:$DB_PORT/$DB_NAME"
echo "🔐 Arquivo de configuração: /var/www/azure-site/.env.local"
echo ""
echo "📋 Credenciais de teste atualizadas:"
echo "   Email: demo@exemplo.com"
echo "   Senha: 123456"
echo "   OU"
echo "   Email: admin@sistema.com"
echo "   Senha: admin123"
echo ""
echo "🔧 Para verificar logs: pm2 logs azure-site"
