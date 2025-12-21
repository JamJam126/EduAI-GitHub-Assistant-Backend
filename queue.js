import { Queue, Worker } from 'bullmq';
import Docker from 'dockerode';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const docker = new Docker();
const connection = { host: '127.0.0.1', port: 6379 };

// Queue
export const codeQueue = new Queue('codeQueue', { connection });

// Worker
export const worker = new Worker(
  'codeQueue',
  async (job) => {
    const { language, code } = job.data;
    const jobId = uuidv4();
    const filename = `temp_${jobId}.${language === 'python' ? 'py' : 'c'}`;
    fs.writeFileSync(filename, code);

    const container = await docker.createContainer({
      Image: language === 'python' ? 'code-runner-python' : 'code-runner-c',
      Cmd: language === 'python'
        ? ['python3', `/code/${filename}`]
        : ['bash', '-c', `gcc /code/${filename} -o /code/out && /code/out`],
      HostConfig: {
        AutoRemove: true,
        Binds: [`${process.cwd()}:/code:ro`],
        NetworkMode: 'none',
        Memory: 256 * 1024 * 1024,
        CpuShares: 512,
      },
    });

    await container.start();

    const stream = await container.logs({ follow: true, stdout: true, stderr: true });
    let output = '';
    stream.on('data', (chunk) => (output += chunk.toString()));
    await new Promise((resolve) => stream.on('end', resolve));

    return { stdout: output.trim(), status: 'success' };
  },
  { connection, concurrency: 10 }
);
