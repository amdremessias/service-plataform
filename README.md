Destaques da Implementação:


Infraestrutura Docker-First:

docker-compose.yml configurado com API (Node.js), Web (Next.js), PostgreSQL/PostGIS e Nginx.
Transição Local -> 

Produção: Nginx preparado para SSL com Certbot e variáveis de ambiente para BASE_URL.
Geolocalização: Uso de PostGIS para busca de prestadores próximos.


Segurança: Headers de segurança no Nginx, validação de JWT e assinaturas de Webhooks.
Funcionalidades:

Cadastro de Admin/Cliente/Parceiro, fluxo de taxa de deslocamento (R$ 100), chat interno e sistema de OTP.
DevOps: 


Makefile para automação (make setup), script de debug e .env.example completo.
