# Exercise
### Table of Contents
- [Exercise](#exercise)
    - [Table of Contents](#table-of-contents)
    - [Resources](#resources)
      - [Library Documentation](#library-documentation)
    - [Assesment](#assesment)
    - [Submission](#submission)
  - [Tasks](#tasks)
    - [Task 1 - Retry Jobs](#task-1---retry-jobs)
    - [Task 2 - Metrics Service](#task-2---metrics-service)
    - [Task 3 - Reasoning & Retrospective](#task-3---reasoning--retrospective)

---
You have been given a collection of services that process and manage fictional jobs. Jobs are created by the `dispatch` service and published onto a message queue, this queue is subscribed to by `worker` services who process the jobs and report status back to the `dispatch` service.

Jobs have a complexity rating which affects how long a job takes to complete. Jobs can occasionally fail.

### Resources

These resources will help you understand the existing code and architecture.

- [Architecture Doc](ARCHITECTURE.md)

#### Library Documentation
- [routing-controllers](https://github.com/typestack/routing-controllers)
- [nsqjs](http://nsqjs.com/)
- [ioredis](https://github.com/luin/ioredis)


### Assesment

These are the areas your work will be assesed on.

- Code Literacy
- Docker
- Architectural Decision Making
- Written Communication


### Submission

While working on these tasks please use Git to track your progress and working by comitting to this repository.

To submit your work archive the repository including the `.git` folder in a `zip` or `tar`.


## Tasks

### Task 1 - Retry Jobs

When a job fails the `worker` updates the status of the job to `Failed`. All jobs eventually succeed so we would like to add a retry mechanism to the system.

Modify existing code or add new code to implement the retrying of jobs.

---
### Task 2 - Metrics Service

Logs are good but we need a higher level overview of how the system is performing, There is a empty `metrics` service that needs to be built.

Build a service that has a HTTP interface to retrieve the following stats.

- Total failed jobs
- Total completed jobs
- Average processing time
- Average processing time by complexity
- Job failure rate (% of all jobs that have failed)

This can be implemented in any way you see fit.

This service doesn't currently have an entry in the docker-compose file so you will need to add that as well. 

---
### Task 3 - Reasoning & Retrospective

Now that you have worked with this system we would like you to write a little about it. 

Explain your solutions to the previous tasks with the reasoning behind your decisions and try to answer the following questions.

- How did you decide on your implemetations?
- Did you consider any alternative implementations and if so why did you not pursue them?
- What considerations would you make in regards to scaling these services?
- Are there any parts you would change / improve in your own work or the existing code and architecture?
- Did you learn anything new whilst working on the exercise?
- What was the best & worst part about this exercise? how could it be made better for other participants?
