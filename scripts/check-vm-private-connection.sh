#!/bin/bash

echo "🔍 TESTE DE CONECTIVIDADE COM VM-PRIVATE"
echo "========================================"

# Solicitar IP da vm-private
read -p "🔗 IP da vm-private: " VM_PRIVATE_IP

echo ""
echo "🧪 Testando conectividade..."

# Teste 1: Ping
echo "1️⃣ Teste de ping..."
if ping -c 3 $VM_PRIVATE_IP > /dev/null 2>&1; then
    echo "✅ Ping: OK"
else
    echo "❌ Ping: FALHOU"
    echo "   - Verifique se o IP está correto"
    echo "   - Verifique se as VMs estão na mesma rede"
    exit 1
fi

# Teste 2: Porta PostgreSQL
echo "2️⃣ Teste de porta PostgreSQL (5432)..."
if timeout 5 bash -c "</dev/tcp/$VM_PRIVATE_IP/5432" 2>/dev/null; then
    echo "✅ Porta 5432: ABERTA"
else
    echo "❌ Porta 5432: FECHADA"
    echo "   - PostgreSQL pode não estar rodando"
    echo "   - Firewall pode estar bloqueando"
    echo "   - postgresql.conf pode não permitir conexões externas"
fi

# Teste 3: Conexão PostgreSQL (se credenciais fornecidas)
read -p "🤔 Testar conexão PostgreSQL? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "👤 Usuário do banco: " DB_USER
    read -p "📊 Nome do banco: " DB_NAME
    read -s -p "🔐 Senha: " DB_PASSWORD
    echo ""
    
    echo "3️⃣ Teste de conexão PostgreSQL..."
    if PGPASSWORD=$DB_PASSWORD psql -h $VM_PRIVATE_IP -p 5432 -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Conexão PostgreSQL: OK"
    else
        echo "❌ Conexão PostgreSQL: FALHOU"
        echo "   - Verifique usuário e senha"
        echo "   - Verifique se o banco existe"
        echo "   - Verifique pg_hba.conf"
    fi
fi

echo ""
echo "🎯 Se todos os testes passaram, você pode executar:"
echo "   ./scripts/master-setup-remote-db.sh"
