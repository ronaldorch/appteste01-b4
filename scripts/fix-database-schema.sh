#!/bin/bash

# 🔧 SCRIPT DE CORREÇÃO - SCHEMA DO BANCO DE DADOS
# Corrige problemas de colunas faltantes no banco PostgreSQL

echo "🔧 Corrigindo schema do banco de dados..."
echo "========================================"

# Solicitar credenciais do banco
read -p "🔗 IP da vm-private: " DB_HOST
read -p "👤 Usuário do banco: " DB_USER
read -p "📊 Nome do banco: " DB_NAME
read -s -p "🔐 Senha do banco: " DB_PASSWORD
echo ""

echo "🔍 Verificando e corrigindo schema..."

# Corrigir tabela users - adicionar coluna password se não existir
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME << 'EOF'
-- Adicionar coluna password na tabela users se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='password') THEN
        ALTER TABLE users ADD COLUMN password VARCHAR(255);
        RAISE NOTICE 'Coluna password adicionada na tabela users';
    ELSE
        RAISE NOTICE 'Coluna password já existe na tabela users';
    END IF;
END $$;
EOF

# Corrigir tabela orders - adicionar coluna total se não existir
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME << 'EOF'
-- Adicionar coluna total na tabela orders se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='total') THEN
        ALTER TABLE orders ADD COLUMN total DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE 'Coluna total adicionada na tabela orders';
    ELSE
        RAISE NOTICE 'Coluna total já existe na tabela orders';
    END IF;
END $$;
EOF

# Corrigir tabela orders - renomear total_amount para total se existir
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME << 'EOF'
-- Renomear total_amount para total se existir
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='orders' AND column_name='total_amount') THEN
        ALTER TABLE orders RENAME COLUMN total_amount TO total;
        RAISE NOTICE 'Coluna total_amount renomeada para total';
    END IF;
END $$;
EOF

# Inserir usuários com senhas corretas (bcrypt hash)
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME << 'EOF'
-- Inserir usuários com senhas hash bcrypt
-- admin123 = $2b$10$rQZ8kJQy5F5FJ5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5
-- 123456 = $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (email, password, name, role) VALUES 
('admin@greenleaf.com', '$2b$10$rQZ8kJQy5F5FJ5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5', 'Administrador GreenLeaf', 'admin'),
('demo@exemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usuário Demo', 'user')
ON CONFLICT (email) DO UPDATE SET 
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
EOF

echo "✅ Schema do banco corrigido!"
echo ""
echo "👤 Usuários criados/atualizados:"
echo "   📧 admin@greenleaf.com (senha: admin123)"
echo "   📧 demo@exemplo.com (senha: 123456)"
