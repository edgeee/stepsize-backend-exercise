import os from 'os';
import nsq from 'nsqjs';
import processJob from './processJob';
import { JobApi } from '../shared/dispatch-client/api';
import { Job } from '../shared/dispatch-client/model/models';

const jobApi = new JobApi('http://dispatch:3000');

const jobReader = new nsq.Reader('job_run', 'workers', {
  nsqdTCPAddresses: 'nsqd:4150',
  messageTimeout: 60000,
  clientId: `worker-${os.hostname}`,
});
jobReader.connect();
const writer = new nsq.Writer('nsqd', 4150);
writer.connect();

jobReader.on('message', async msg => {
  const job = JSON.parse(msg.body.toString());
  try {
    console.log('Processing job', job.id);
    let resp = await jobApi.jobControllerUpdate(job.id, {
      status: Job.StatusEnum.Processing,
    });
    writer.publish('job_status_change', {
      job: resp.body,
      changeTimestamp: (new Date()).getTime()
    });

    await processJob(job);
    console.log('Job complete', job.id);
    resp = await jobApi.jobControllerUpdate(job.id, {
      status: Job.StatusEnum.Completed,
      completedAt: '' + new Date()
    });

    writer.publish('job_status_change', {
      job: resp.body,
      changeTimestamp: (new Date()).getTime()
    });
  } catch (e) {
    console.log('Job failed', job.id);
    const resp = await jobApi.jobControllerUpdate(job.id, {
      status: Job.StatusEnum.Failed,
    });

    writer.publish('job_status_change', {
      job: resp.body,
      changeTimestamp: (new Date()).getTime()
    });
  } finally {
    msg.finish();
  }
});
