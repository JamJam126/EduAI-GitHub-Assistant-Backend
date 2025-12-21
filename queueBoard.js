import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { codeQueue } from './queue.js';

const app = express();

// Setup dashboard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(codeQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

app.listen(8081, () => console.log("Backend & dashboard running on http://localhost:8081"));
