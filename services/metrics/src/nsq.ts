import os from 'os';
import nsq from 'nsqjs';

export const jobReader = new nsq.Reader('job_status_change', 'metrics', {
  nsqdTCPAddresses: 'nsqd:4150',
  messageTimeout: 60000,
  clientId: `metrics-${os.hostname}`,
});

try {
  jobReader.connect();
} catch (e) {
  console.error('Could not connect to NSQ daemon'); // tslint:disable-line
  console.error(e); // tslint:disable-line
}
