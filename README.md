# crud-api

## Description
App to create, read, update and delete users.

## Pre-requisites
- [nvm](https://github.com/nvm-sh/nvm) (recommended)
- Node.js v18.13.0 or later (you can run `nvm use`)
- Docker
- Docker Compose

## Installation
- setup `.env` file, you can use `.env.example` as template
- `npm install`
 
## Run Development Server
- run `docker compose up -d pg` to start postgres container
- run `npm run start:dev` to start development server, the server will be listening on port 3000 as default

## Run Production Server
- run `docker compose up -d`, this will setup the postgres container and the builded server in app container

## Run Tests
- run `docker compose up -f docker-compose.test.yml -d pg` to start postgres test db container
- run `npm run test` to run tests

## Code Formatting
To ensure consistent code formatting in this project please follow the steps below:
- fix any linting errors, we use pre-commit hooks to ensure code is linted before commiting
- run `npm run lint:fix` to fix the linting errors

## API Documentation
The API documentation is available in the [docs](./docs/openapi.yaml) folder. You can view the documentation by opening the files in your browser or using a compatible documentation viewer.
