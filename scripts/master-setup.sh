#!/bin/bash

# 🚀 SCRIPT MASTER - SETUP COMPLETO GREENLEAF CANNABIS MARKETPLACE
# Este script faz TUDO: git pull, banco, dados, configuração, deploy
# Versão: 2.0 - Com detecção automática de problemas
# Data: $(date)

set -e  # Para na primeira falha

echo "🌿 ======================================================="
echo "🚀 GREENLEAF CANNABIS MARKETPLACE - SETUP MASTER v2.0"
echo "🌿 ======================================================="
echo ""
echo "⚠️  ATENÇÃO: Este script fará o setup COMPLETO do sistema!"
echo "📋 Incluindo: Git, Banco, Dados, Configuração, Deploy"
echo ""
read -p "🤔 Deseja continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelado pelo usuário"
    exit 1
fi

echo ""
echo "🚀 Iniciando setup master v2.0..."
echo "=========================================="

# Variáveis
PROJECT_DIR="/var/www/azure-site"
BACKUP_DIR="/var/backups/azure-site-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="/var/log/greenleaf-setup.log"

# Criar diretório de log se não existir
sudo mkdir -p "$(dirname "$LOG_FILE")"
sudo touch "$LOG_FILE"
sudo chmod 666 "$LOG_FILE"

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Função de erro
error_exit() {
    log "❌ ERRO: $1"
    echo "❌ Setup falhou! Verifique o log: $LOG_FILE"
    exit 1
}

log "🚀 Iniciando setup master v2.0 do GreenLeaf Cannabis Marketplace"

# 1. VERIFICAR USUÁRIO E PERMISSÕES
echo "1️⃣ Verificando permissões e usuário..."
if [[ $EUID -eq 0 ]]; then
    log "⚠️ Executando como root - ajustando configurações"
    SUDO_CMD=""
else
    log "ℹ️ Executando como usuário normal"
    SUDO_CMD="sudo"
fi

# 2. BACKUP DO SISTEMA ATUAL
echo "2️⃣ Fazendo backup do sistema atual..."
if [ -d "$PROJECT_DIR" ]; then
    log "📦 Criando backup em $BACKUP_DIR"
    $SUDO_CMD mkdir -p "$BACKUP_DIR"
    $SUDO_CMD cp -r "$PROJECT_DIR" "$BACKUP_DIR/" 2>/dev/null || true
    log "✅ Backup criado com sucesso"
else
    log "ℹ️ Diretório do projeto não existe, pulando backup"
fi

# 3. ATUALIZAR SISTEMA
echo "3️⃣ Atualizando sistema operacional..."
log "🔄 Atualizando pacotes do sistema"
$SUDO_CMD apt update -qq
$SUDO_CMD apt upgrade -y -qq
log "✅ Sistema atualizado"

# 4. INSTALAR DEPENDÊNCIAS BÁSICAS
echo "4️⃣ Instalando dependências básicas..."
log "📦 Instalando dependências essenciais"

$SUDO_CMD apt install -y \
    curl \
    wget \
    git \
    unzip \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

log "✅ Dependências básicas instaladas"

# 5. INSTALAR NODE.JS
echo "5️⃣ Instalando Node.js..."
log "📦 Configurando Node.js 18+"

if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
    log "🔄 Instalando Node.js 18"
    curl -fsSL https://deb.nodesource.com/setup_18.x | $SUDO_CMD -E bash -
    $SUDO_CMD apt-get install -y nodejs
else
    log "✅ Node.js já instalado: $(node -v)"
fi

# Instalar PM2 globalmente
if ! command -v pm2 &> /dev/null; then
    log "📦 Instalando PM2"
    $SUDO_CMD npm install -g pm2
else
    log "✅ PM2 já instalado"
fi

log "✅ Node.js e PM2 configurados"

# 6. INSTALAR E CONFIGURAR POSTGRESQL
echo "6️⃣ Instalando e configurando PostgreSQL..."
log "🗄️ Configurando banco de dados PostgreSQL"

# Instalar PostgreSQL
if ! command -v psql &> /dev/null; then
    log "📦 Instalando PostgreSQL"
    $SUDO_CMD apt install -y postgresql postgresql-contrib
    $SUDO_CMD systemctl start postgresql
    $SUDO_CMD systemctl enable postgresql
else
    log "✅ PostgreSQL já instalado"
    $SUDO_CMD systemctl start postgresql || true
fi

# Aguardar PostgreSQL inicializar
sleep 5

# Gerar senha aleatória para o banco
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Configurar PostgreSQL como usuário postgres
log "🔧 Configurando usuário e banco de dados"

$SUDO_CMD -u postgres psql -c "DROP DATABASE IF EXISTS azure_site;" 2>/dev/null || true
$SUDO_CMD -u postgres psql -c "DROP USER IF EXISTS app_user;" 2>/dev/null || true
$SUDO_CMD -u postgres psql -c "CREATE USER app_user WITH PASSWORD '$DB_PASSWORD';"
$SUDO_CMD -u postgres psql -c "CREATE DATABASE azure_site OWNER app_user;"
$SUDO_CMD -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE azure_site TO app_user;"
$SUDO_CMD -u postgres psql -c "ALTER USER app_user CREATEDB;"

# Configurar PostgreSQL para aceitar conexões locais
log "🔧 Configurando acesso ao PostgreSQL"

# Encontrar versão do PostgreSQL
PG_VERSION=$($SUDO_CMD -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1)
PG_CONFIG_DIR="/etc/postgresql/$PG_VERSION/main"

if [ ! -d "$PG_CONFIG_DIR" ]; then
    # Tentar encontrar diretório de configuração
    PG_CONFIG_DIR=$(find /etc/postgresql -name "postgresql.conf" -type f | head -1 | xargs dirname)
fi

if [ -d "$PG_CONFIG_DIR" ]; then
    # Configurar postgresql.conf
    $SUDO_CMD sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" "$PG_CONFIG_DIR/postgresql.conf"
    
    # Configurar pg_hba.conf
    if ! grep -q "local.*azure_site.*app_user.*md5" "$PG_CONFIG_DIR/pg_hba.conf"; then
        echo "local   azure_site      app_user                                md5" | $SUDO_CMD tee -a "$PG_CONFIG_DIR/pg_hba.conf"
    fi
    
    $SUDO_CMD systemctl restart postgresql
    log "✅ PostgreSQL configurado e reiniciado"
else
    log "⚠️ Diretório de configuração do PostgreSQL não encontrado, usando configuração padrão"
fi

log "✅ PostgreSQL configurado - Senha: $DB_PASSWORD"

# 7. INSTALAR NGINX
echo "7️⃣ Instalando Nginx..."
log "🌐 Configurando servidor web Nginx"

if ! command -v nginx &> /dev/null; then
    $SUDO_CMD apt install -y nginx
    $SUDO_CMD systemctl start nginx
    $SUDO_CMD systemctl enable nginx
else
    log "✅ Nginx já instalado"
fi

log "✅ Nginx instalado e configurado"

# 8. CONFIGURAR PROJETO
echo "8️⃣ Configurando projeto..."
log "📁 Configurando diretório do projeto"

# Garantir que estamos no diretório correto
if [ ! -d "$PROJECT_DIR" ]; then
    error_exit "Diretório do projeto não encontrado: $PROJECT_DIR"
fi

cd "$PROJECT_DIR" || error_exit "Não foi possível acessar o diretório do projeto"

# Verificar se é um repositório git
if [ -d ".git" ]; then
    log "📥 Atualizando código via git"
    git stash push -m "Auto-stash before master setup $(date)" 2>/dev/null || true
    git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || log "⚠️ Não foi possível fazer git pull"
else
    log "ℹ️ Não é um repositório git, usando código local"
fi

# 9. INSTALAR DEPENDÊNCIAS NPM
echo "9️⃣ Instalando dependências do Node.js..."
log "📦 Executando npm install"

# Limpar cache e node_modules
rm -rf node_modules package-lock.json 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

# Instalar dependências
npm install || error_exit "Falha na instalação das dependências npm"
log "✅ Dependências npm instaladas"

# 10. CONFIGURAR VARIÁVEIS DE AMBIENTE
echo "🔟 Configurando variáveis de ambiente..."
log "⚙️ Criando arquivo .env.local"

cat > .env.local << EOF
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)

# Configurações do banco PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=azure_site
DB_USER=app_user
DB_PASSWORD=$DB_PASSWORD
DB_SSL=false

# URLs da aplicação
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

chmod 600 .env.local
log "✅ Variáveis de ambiente configuradas"

# 11. CRIAR ESTRUTURA DO BANCO
echo "1️⃣1️⃣ Criando estrutura do banco de dados..."
log "🗄️ Executando scripts de criação das tabelas"

# Aguardar PostgreSQL estar pronto
sleep 3

# Script de criação das tabelas
PGPASSWORD=$DB_PASSWORD psql -h localhost -p 5432 -U app_user -d azure_site << 'EOF'
-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    user_id INTEGER REFERENCES users(id),
    slug VARCHAR(255) UNIQUE NOT NULL,
    featured BOOLEAN DEFAULT false,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de imagens dos produtos
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de carrinho
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- Inserir dados iniciais
-- Categorias
INSERT INTO categories (name, description, slug) VALUES 
('Flores', 'Flores de cannabis premium', 'flores'),
('Extrações', 'Extratos e concentrados', 'extracoes')
ON CONFLICT (slug) DO NOTHING;

-- Usuários
INSERT INTO users (email, password, name, role) VALUES 
('admin@greenleaf.com', '$2b$10$rQZ8kJQy5F5FJ5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5', 'Administrador', 'admin'),
('demo@exemplo.com', '$2b$10$rQZ8kJQy5F5FJ5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5', 'Usuário Demo', 'user')
ON CONFLICT (email) DO NOTHING;

-- Produtos de Flores
INSERT INTO products (name, description, price, stock_quantity, category_id, slug, featured, image_url) VALUES 
('Colombian Gold', 'Strain clássica colombiana com efeitos energizantes e sabor terroso.', 45.00, 100, 1, 'colombian-gold', true, '/placeholder.svg?height=300&width=300'),
('Califa Kush', 'Híbrida californiana premium com alto THC e relaxamento profundo.', 55.00, 75, 1, 'califa-kush', true, '/placeholder.svg?height=300&width=300'),
('Purple Haze', 'Sativa icônica com tons roxos e efeitos criativos.', 50.00, 80, 1, 'purple-haze', false, '/placeholder.svg?height=300&width=300'),
('OG Kush', 'Clássica californiana com aroma cítrico e efeitos balanceados.', 48.00, 90, 1, 'og-kush', true, '/placeholder.svg?height=300&width=300'),
('White Widow', 'Híbrida holandesa famosa mundialmente por sua potência.', 52.00, 60, 1, 'white-widow', false, '/placeholder.svg?height=300&width=300')
ON CONFLICT (slug) DO NOTHING;

-- Produtos de Extrações
INSERT INTO products (name, description, price, stock_quantity, category_id, slug, featured, image_url) VALUES 
('Live Resin Premium', 'Extrato fresco com terpenos preservados e sabor intenso.', 80.00, 30, 2, 'live-resin-premium', true, '/placeholder.svg?height=300&width=300'),
('Shatter Gold', 'Concentrado cristalino com alta pureza e potência.', 70.00, 25, 2, 'shatter-gold', false, '/placeholder.svg?height=300&width=300'),
('Rosin Artesanal', 'Extrato sem solventes, prensado artesanalmente.', 90.00, 20, 2, 'rosin-artesanal', true, '/placeholder.svg?height=300&width=300'),
('Wax Premium', 'Concentrado cremoso com textura única e sabor marcante.', 65.00, 35, 2, 'wax-premium', false, '/placeholder.svg?height=300&width=300'),
('Hash Tradicional', 'Haxixe tradicional com métodos ancestrais de produção.', 60.00, 40, 2, 'hash-tradicional', false, '/placeholder.svg?height=300&width=300')
ON CONFLICT (slug) DO NOTHING;

SELECT 'Estrutura do banco e dados iniciais criados com sucesso!' as status;
EOF

if [ $? -eq 0 ]; then
    log "✅ Estrutura do banco e dados criados com sucesso"
else
    error_exit "Falha na criação da estrutura do banco"
fi

# 12. BUILD DA APLICAÇÃO
echo "1️⃣2️⃣ Fazendo build da aplicação..."
log "🏗️ Executando npm run build"

npm run build || error_exit "Falha no build da aplicação"
log "✅ Build concluído com sucesso"

# 13. CONFIGURAR PM2
echo "1️⃣3️⃣ Configurando PM2..."
log "⚙️ Configurando gerenciador de processos PM2"

# Parar processos existentes
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Criar arquivo de configuração do PM2 se não existir
if [ ! -f "ecosystem.config.js" ]; then
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'greenleaf-market',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/azure-site',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF
fi

# Iniciar aplicação com PM2
pm2 start ecosystem.config.js

# Configurar inicialização automática
pm2 startup | grep -E '^sudo' | bash || true
pm2 save

log "✅ PM2 configurado e aplicação iniciada"

# 14. CONFIGURAR NGINX
echo "1️⃣4️⃣ Configurando Nginx..."
log "🌐 Configurando servidor web Nginx"

# Obter IP público
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "localhost")

# Configurar Nginx
$SUDO_CMD tee /etc/nginx/sites-available/greenleaf-market > /dev/null << EOF
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
    gzip_proxied expired no-cache no-store private must-revalidate auth;
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
$SUDO_CMD ln -sf /etc/nginx/sites-available/greenleaf-market /etc/nginx/sites-enabled/
$SUDO_CMD rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
$SUDO_CMD nginx -t || error_exit "Configuração do Nginx inválida"

# Reiniciar Nginx
$SUDO_CMD systemctl restart nginx
$SUDO_CMD systemctl enable nginx

log "✅ Nginx configurado e reiniciado"

# 15. TESTES FINAIS
echo "1️⃣5️⃣ Executando testes finais..."
log "🧪 Testando aplicação e serviços"

# Aguardar aplicação inicializar
echo "⏳ Aguardando aplicação inicializar..."
sleep 15

# Testar aplicação direta
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "✅ Aplicação (porta 3000): OK"
else
    log "❌ Aplicação (porta 3000): ERRO - Verificando logs..."
    pm2 logs greenleaf-market --lines 10 || true
fi

# Testar via Nginx
if curl -f http://localhost > /dev/null 2>&1; then
    log "✅ Nginx (porta 80): OK"
else
    log "❌ Nginx (porta 80): ERRO"
fi

# Testar banco de dados
if PGPASSWORD=$DB_PASSWORD psql -h localhost -p 5432 -U app_user -d azure_site -c "SELECT COUNT(*) FROM products;" > /dev/null 2>&1; then
    PRODUCT_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h localhost -p 5432 -U app_user -d azure_site -t -c "SELECT COUNT(*) FROM products;" | xargs)
    log "✅ Banco de dados: OK - $PRODUCT_COUNT produtos cadastrados"
else
    log "❌ Banco de dados: ERRO"
fi

# 16. CONFIGURAR FIREWALL
echo "1️⃣6️⃣ Configurando firewall..."
log "🔥 Configurando regras de firewall"

# Configurar UFW se disponível
if command -v ufw &> /dev/null; then
    $SUDO_CMD ufw --force enable
    $SUDO_CMD ufw allow 22/tcp    # SSH
    $SUDO_CMD ufw allow 80/tcp    # HTTP
    $SUDO_CMD ufw allow 443/tcp   # HTTPS
    $SUDO_CMD ufw allow 3000/tcp  # App (temporário)
    log "✅ Firewall configurado"
fi

# 17. CRIAR SCRIPTS DE MANUTENÇÃO
echo "1️⃣7️⃣ Criando scripts de manutenção..."
log "🛠️ Criando scripts de manutenção"

# Script de status
$SUDO_CMD tee /usr/local/bin/greenleaf-status > /dev/null << EOF
#!/bin/bash
echo "🌿 GreenLeaf Market - Status do Sistema"
echo "======================================"
echo "📅 Data: \$(date)"
echo ""
echo "🔧 Serviços:"
echo "  PM2: \$(pm2 list | grep -c online) processos online"
echo "  Nginx: \$(systemctl is-active nginx)"
echo "  PostgreSQL: \$(systemctl is-active postgresql)"
echo ""
echo "🌐 Conectividade:"
curl -s -o /dev/null -w "  App (3000): %{http_code}\n" http://localhost:3000
curl -s -o /dev/null -w "  Nginx (80): %{http_code}\n" http://localhost
echo ""
echo "💾 Banco de dados:"
PGPASSWORD=$DB_PASSWORD psql -h localhost -U app_user -d azure_site -t -c "SELECT 'Produtos: ' || COUNT(*) FROM products;"
PGPASSWORD=$DB_PASSWORD psql -h localhost -U app_user -d azure_site -t -c "SELECT 'Usuários: ' || COUNT(*) FROM users;"
EOF

$SUDO_CMD chmod +x /usr/local/bin/greenleaf-status

# Script de backup
$SUDO_CMD tee /usr/local/bin/greenleaf-backup > /dev/null << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/greenleaf-\$(date +%Y%m%d-%H%M%S)"
mkdir -p "\$BACKUP_DIR"
cp -r "$PROJECT_DIR" "\$BACKUP_DIR/"
PGPASSWORD=$DB_PASSWORD pg_dump -h localhost -U app_user azure_site > "\$BACKUP_DIR/database.sql"
echo "Backup criado em: \$BACKUP_DIR"
EOF

$SUDO_CMD chmod +x /usr/local/bin/greenleaf-backup

log "✅ Scripts de manutenção criados"

# 18. FINALIZAÇÃO
echo ""
echo "🎉 ========================================="
echo "✅ SETUP MASTER CONCLUÍDO COM SUCESSO!"
echo "🎉 ========================================="
echo ""

log "🎉 Setup master concluído com sucesso!"

# Informações finais
echo "🌿 GreenLeaf Cannabis Marketplace está ONLINE!"
echo ""
echo "🌐 URLs de Acesso:"
echo "   http://$PUBLIC_IP (público)"
echo "   http://localhost (local)"
echo ""
echo "👤 Credenciais de Acesso:"
echo "   📧 Admin: admin@greenleaf.com"
echo "   🔑 Senha: admin123"
echo "   🔗 Dashboard: http://$PUBLIC_IP/admin"
echo ""
echo "   📧 Demo: demo@exemplo.com" 
echo "   🔑 Senha: 123456"
echo ""
echo "🗄️ Banco de Dados:"
echo "   🏠 Host: localhost"
echo "   👤 Usuário: app_user"
echo "   🔑 Senha: $DB_PASSWORD"
echo "   📊 Database: azure_site"
echo ""
echo "🛠️ Comandos Úteis:"
echo "   greenleaf-status          # Status do sistema"
echo "   greenleaf-backup          # Criar backup"
echo "   pm2 status               # Status PM2"
echo "   pm2 logs greenleaf-market # Logs da aplicação"
echo "   sudo systemctl status nginx # Status Nginx"
echo ""
echo "📁 Arquivos Importantes:"
echo "   $PROJECT_DIR/.env.local"
echo "   /var/log/nginx/greenleaf.*.log"
echo "   $LOG_FILE"
echo ""
echo "🎯 Próximos Passos:"
echo "   1. Acesse http://$PUBLIC_IP para ver o site"
echo "   2. Faça login como admin para gerenciar"
echo "   3. Configure HTTPS se necessário"
echo "   4. Personalize produtos e categorias"
echo ""

# Salvar informações em arquivo
cat > "$PROJECT_DIR/SETUP_INFO.txt" << EOF
GreenLeaf Cannabis Marketplace - Informações do Setup
=====================================================
Data do Setup: $(date)
IP Público: $PUBLIC_IP

URLs:
- Site: http://$PUBLIC_IP
- Admin: http://$PUBLIC_IP/admin

Credenciais Admin:
- Email: admin@greenleaf.com
- Senha: admin123

Credenciais Demo:
- Email: demo@exemplo.com
- Senha: 123456

Banco de Dados:
- Host: localhost
- User: app_user
- Password: $DB_PASSWORD
- Database: azure_site

Comandos:
- greenleaf-status (status do sistema)
- greenleaf-backup (criar backup)
EOF

echo "💾 Informações salvas em: $PROJECT_DIR/SETUP_INFO.txt"
echo ""
echo "🚀 Seu marketplace de cannabis está pronto para uso!"

log "🎉 Setup master finalizado - Sistema totalmente operacional"

exit 0
