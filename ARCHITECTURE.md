# Architecture
### Table of Contents
- [Architecture](#architecture)
    - [Table of Contents](#table-of-contents)
- [Dispatch](#dispatch)
- [Worker](#worker)
- [NSQ](#nsq)

---
This document will explain the existing architecture of the services.

![Diagram](https://i.imgur.com/vGhsvfJ.png)

# Dispatch
The dispatch service exposes a simple REST API, it has a Redis database that it uses to store data about jobs. All changes to the data is handled by this service.

It publishes jobs onto a [nsq](https://nsq.io/) topic using [nsqjs](https://github.com/dudleycarr/nsqjs)

A client library for interacting with this service is automatically generated using its OpenAPI schema. This client is copied into the `shared` directory of each service. The schema that generates this client can be acessed at the following URL [http://localhost:3001](http://localhost:3001) when the service is running.

If you modify the `dispatch` service and want to re-generate the client there is a script in the tools directory called `generate-dispatch-client.sh` running this will regenerate the client and path/copy it into services shared folders.

The service itself is built using [Express](https://expressjs.com/) and [`routing-controllers`](https://github.com/typestack/routing-controllers)

I's uses [Redis](https://redis.io/) for storage with the [ioredis](https://github.com/luin/ioredis) library. There is a simple base entity at `src/entities/base.ts` which can be extended to produce ActiveRecord style models for handling data in Redis. This is supposed to replicate an ORM.

Documentation for the REST api can be found in the `docs` folder if needed.

⚠️ The dispatch service does not automatically create jobs, you will need to send HTTP `POST` requests to the `/api/job` endpoint.

# Worker
The worker service subscribes to the nsq topic dispatch publishes jobs onto, when it receives a job it processes it and reports its status to the dispatch service using the dispatch client.

It also publishes status updates onto nsq topics

# NSQ
nsq is a lightweight message queue, you don't need a deep understanding of how it works to complete this exercise but it will be useful to know what topics are currently implemented and being used

| topic          | dispatch | worker |
| -------------- | -------- | ------ |
| job_run        | **P**    | **S**  |
| job_processing |          | **P**  |
| job_complete   |          | **P**  |
| job_failed     |          | **P**  |

**P** - Publishes  
**S** - Subscribes  
**P/S** - Publishes & Subscribes
