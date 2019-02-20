import nsq from 'nsqjs';

export const writer = new nsq.Writer('nsqd', 4150);
try {
  writer.connect();
} catch (e) {
  console.error('Could not connect to NSQ daemon');
  console.error(e);
}
