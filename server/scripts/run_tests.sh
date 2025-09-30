#!/bin/bash
set -e  # Exit on error

echo "Setting up environment..."
cd server/scripts
export DJANGO_SETTINGS_MODULE=base.settings
export ENV=testing
export PYTHONPATH=$PWD
export SECRET_KEY="test-secret-key-1234567890abcdef"

# Load environment variables for Docker Compose
set -a # automatically export all variables
source ../.env.test
set +a

echo "Starting test database..."

docker-compose -f ../../docker-compose.test.yml up --build -d

echo "Running tests against Dockerized PostgreSQL..."

docker-compose -f ../../docker-compose.test.yml run --rm testapp \
    sh -c "/usr/local/bin/wait-for-it.sh testdb:5432 --timeout=60 --strict -- \
        python manage.py migrate --noinput && pytest --cov --cov-config=.coveragerc"

echo "Stopping test database..."

docker-compose -f ../../docker-compose.test.yml down

echo "Tests completed successfully!"