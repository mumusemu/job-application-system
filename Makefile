# Makefile

# Build and start the containers for the first time
dev-first-run:
	@echo "Starting the development environment for the first time..."
	docker-compose up --build

# Start the containers in the future (without rebuilding)
dev:
	@echo "Starting the development environment..."
	docker-compose up

# Start the containers without rebuilding
dev-run:
	@echo "Starting the development environment (run mode)..."
	docker-compose up

start-db-admin:
	docker-compose up db phpmyadmin

start-db-server:
	docker-compose up db phpmyadmin server

start-client:
	docker-compose up client

# Stop the containers
stop:
	@echo "Stopping the development environment..."
	docker-compose down

# Remove all containers, volumes, and networks
clean:
	@echo "Cleaning up the development environment..."
	docker-compose down -v --rmi all --remove-orphans


clean-packages: ## Remove dependencies directories
	rm -Rf node_modules client/node_modules
