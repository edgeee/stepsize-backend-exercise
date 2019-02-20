const complexityUnitCost = 1000;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function fakeProcessingTime(complexity) {
  const loadSpike = randomInt(0, 100) < 30; // 30% Chance;
  const baseTime = complexity * complexityUnitCost;
  const randomVariation = randomInt(0, 5000);
  let loadSpikeTime = 0;
  if (loadSpike) {
    loadSpikeTime = randomInt(1000, 4000) * complexity;
  }
  return baseTime + randomVariation + loadSpikeTime;
}

export default function processJob(job) {
  const shouldFail = randomInt(0, 100) < 20; // 20% Chance;
  const processingTime = fakeProcessingTime(job.complexity);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) return reject(new Error('Job could not be processed, try again later'));
      return resolve();
    }, processingTime);
  });
}
