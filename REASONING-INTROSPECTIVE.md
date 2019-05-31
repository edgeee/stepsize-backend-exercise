# Summary

All required tasks were implemented and tested to ensure it works as it should.

## Task 1: Retry Jobs
Total time spent: ~30 mins.

The aim of this task was to improve the reliability of the system by ensuring all jobs are eventually completed. A job could fail for any number of reason; so it makes sense to at least retry them, irrespective of the cause of failure. The `retry job` operation is done in the job dispatcher's update flow. Since by requirements, the worker *updates* the job dispatcher when a job fails, it made sense to hook into this logic and try to do the retry operation. Jobs now have a `retries` attribute that indicates the number of times the job was retried before eventually succeeding or failing completely. Jobs can only be retried for a given number of times (the `RETRY_THRESHOLD`), after which the job is deemed as failed and irredeemable. The system uses exponential backoff to prolong successive retry operations. This greatly improves the likelihood of a job succeeding; for example, if a job pulls data from third party API that is currently unavailable, this technique increases the likelihood for eventual success by delaying successive retries.

Another alternative on this implementation is to continually retry without the `RETRY_THRESHOLD` limit. Although this seems like the right thing to do (given that the requirements mention **all jobs eventually succeeds**), it is not necessarily the best way to do it. Take for instance, a job that pulls huge blocks of data from an external service, then does some aggregation on it, and sends the aggregated data to another service. If for any reason, the second service becomes unavailable for a long period of time, the computation done by this job will now be wasteful and unnecessary, and would computes a lot of resources each time.

### Improvements
- Make `RETRY_THRESHOLD` configurable (it should be specified on system initialization, e.g. through command line args.)

## Task 2: Metrics Service

Total time spent: 2:30 mins

The aim of this exercise was to improve the overall statistics and reporting of the system. The service has one basic feature currently: report stats of processed jobs. It provides a RESTful interface to get these stats. This service uses redis (with `ioredis` client library) as a `key-value` datastore. The primary motivation for using redis as a datastore as opposed to more natural database solutions was the nature of the data & performance. Stats are basically key-value structures; for example `total jobs count`(key) is `320` (value). The use of redis affords us efficient queries (since all data is in-memory). The service listens for `job_status_change` messages on an nsq channel and computes the stats for failed/completed job status. The `job_status_change` message body contains a timestamp indicating when this status change occurred. This helps us in better estimating when the given job started and ended, and how long it took to complete/fail. Also, all `job_*` messages published by worker services have now been removed and replaced with a single `job_status_change` message. This simplifies the processing of jobs by services that care about such message types. Clients can efficiently filter messages by `status` and only process changes they care about.


### Improvements
- Write unit tests


## Scaling
Basically, the easiest way to scale these services is to add more instances, and proxy requests to them using a load balancer (e.g. nginx). Also, given the way the metrics data access layer is currently implemented, when adding more instances of the metrics service, we'd need to implement some sort of transaction-like behavior so as to avoid data read/read race-conditions.

## General Improvements
- Write more (a lot) unit tests

## Learnings
Yes, I learnt a few things: I had never used `nsq` for distributed messaging before now. Although I've built services/APIs in TypeScript/Node, I hadn't heard of/used `routing-controllers` before now also.

## Feedback
Generally, the structure and quality of the exercises is good. I especially like the setup script provided. This saved me a lot of time ):