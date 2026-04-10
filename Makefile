up: ## Sobe os containers Docker em modo detached
	docker-compose up -d

build: ## Constrói as imagens Docker dos serviços
	docker-compose build

stop: ## Para os containers Docker
	docker-compose stop

down: ## Para e remove os containers, redes e volumes
	docker-compose down -v

logs: ## Exibe os logs de todos os serviços
	docker-compose logs -f

restart: ## Reinicia os containers
	docker-compose restart

exec-api: ## Executa um comando no container da API
	docker-compose exec api bash

exec-web: ## Executa um comando no container do Web
	docker-compose exec web bash

exec-db: ## Executa um comando no container do Banco de Dados
	docker-compose exec db bash

migrate: ## Executa as migrações do banco de dados (exemplo, ajuste conforme seu ORM)
	docker-compose exec api npm run typeorm migration:run -- -d dist/data-source.js

seed: ## Executa seeds do banco de dados (exemplo)
	docker-compose exec api npm run typeorm seed:run -- -d dist/data-source.js

setup: build up migrate ## Constrói, sobe os containers e executa as migrações

.PHONY: up build stop down logs restart exec-api exec-web exec-db migrate seed setup
