DEV_COMPOSE_FILE=docker-compose-dev.yml

.PHONY: compose-build
compose-build:
	docker compose -f $(DEV_COMPOSE_FILE) build

.PHONY: compose-up
compose-up:
	docker compose -f $(DEV_COMPOSE_FILE) up

.PHONY: compose-up-build
compose-up-build:
	docker compose -f $(DEV_COMPOSE_FILE) up --build

.PHONY: compose-build-no-cache
compose-build-no-cache:
	docker compose -f ${DEV_COMPOSE_FILE} build --no-cache

.PHONY: compose-down
compose-down:
	docker compose -f $(DEV_COMPOSE_FILE) down