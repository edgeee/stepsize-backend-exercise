# Stepsize Backend Exercise
### Table of Contents
- [Stepsize Backend Exercise](#stepsize-backend-exercise)
    - [Table of Contents](#table-of-contents)
    - [Links](#links)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Running](#running)
  - [Workflow](#workflow)

---
This repo contains the code required to complete the Stepsize [backend exercise](EXERCISE.md).

### Links
- [Exercise](EXERCISE.md)
- [Architecture](ARCHITECTURE.md)
- [Reasoning & Introspective](REASONING-INTROSPECTIVE.md)

## Prerequisites
- [Node.js 10 (LTS)](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Typescript 3](https://www.typescriptlang.org/)
- [Docker & Docker Compose](https://www.docker.com/)

## Setup

Some scripts are included to make setup easier. The following commands will clone this repo and run the setup scripts.

```
git clone https://github.com/Stepsize/backend-exercise/ stepsize-backend-exercise
cd stepsize-backend-exercise/tools
./setup.sh
cd ../
```

## Running

Services can be started using

```
docker-compose up --build
```

The dispatch service is exposed on http://localhost:3001
The metrics service is exposed on http://localhost:4001

You can scale the worker service up / down by doing.
```
docker-compose up --build --scale=worker=X
```

Replace X with the number of replicas you would like.

## Workflow

The containers are using `ts-node-dev` and source directories are mounted inside the containers, this means that services will restart when you make code changes. If you install new dependencies containers will need to be rebuilt.

If you prefer to not restart services on code changes you can modify the start commands in individual services `package.json` files to use `ts-node` instead.
