DOCKER_SERVER := docker compose run --rm --workdir="/app" server
DOCKER_CLIENT := docker compose run --rm --workdir="/app" client

PIPENV := PIPENV_PIPFILE=server/Pipfile pipenv
RUN := $(PIPENV) run

.PHONY: install
install:
	PIPENV_VENV_IN_PROJECT=1 $(PIPENV) install --dev --python 3.12

.PHONY: sort-imports check-imports format check-format lint typecheck security
sort-imports:
	$(RUN) isort server
check-imports:
	$(RUN) isort --check-only --diff server
format:
	$(RUN) black server
check-format:
	$(RUN) black --check --diff server
lint:
	$(RUN) flake8 . --config server/.flake8
typecheck:
	$(RUN) mypy server
pylint:
	DJANGO_SETTINGS_MODULE=base.settings $(RUN) pylint server --rcfile=server/.pylintrc
security:
	$(RUN) bandit -r . -c server/.bandit
remove-unused-imports:
	$(RUN) autoflake --in-place --remove-all-unused-imports -r server

.PHONY: check-all
check: check-imports check-format lint security pylint
	@echo "All code quality checks passed!"

.PHONY: fix
fix: remove-unused-imports sort-imports format
	@echo "Code has been fixed and formatted!"

.PHONY: docker-migrations
migrations:
	$(DOCKER_SERVER) python manage.py makemigrations

.PHONY: docker-migrate
migrate:
	$(DOCKER_SERVER) python manage.py migrate

.PHONY: superuser
superuser:
	$(DOCKER_SERVER) python manage.py create_default_superuser

.PHONY: docker-up
docker-up:
	docker compose -f docker-compose.yml up --build

.PHONY: docker-down
docker-down:
	docker compose -f docker-compose.yml down

.PHONY: all clean tests
tests:
	sh server/scripts/run_tests.sh

.PHONY: dev
dev: install \
	migrations \
	migrate \
	superuser \
	docker-up

.PHONY: stop
stop: docker-down
