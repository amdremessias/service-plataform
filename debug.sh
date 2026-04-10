#!/bin/bash

echo "Verificando a saúde dos containers Docker..."
docker-compose ps

echo "\nVerificando logs do serviço API para conexão com o banco de dados e migrações..."
docker-compose logs api | grep "Database connected!"

if [ $? -eq 0 ]; then
    echo "API conectada ao banco de dados com sucesso."
else
    echo "AVISO: API pode não estar conectada ao banco de dados. Verifique os logs acima."
fi

echo "\nVerificação de debug concluída."
