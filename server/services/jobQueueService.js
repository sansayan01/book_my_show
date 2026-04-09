/**
 * Background Job Queue Service (Mock)
 * Handles async task processing
 */
const { v4: uuidv4 } = require('uuid');

class JobQueueService {
  constructor() {
    this.jobs = new Map();
    this.processors = new Map();
    this.isProcessing = false;
    this.stats = {
      totalProcessed: 0,
      totalFailed: 0,
      totalQueued: 0
    };
  }

  /**
   * Register a job processor
   */
  registerProcessor(jobName, processor) {
    this.processors.set(jobName, processor);
    console.log(`Job processor registered: ${jobName}`);
  }

  /**
   * Enqueue a job
   */
  async enqueue(jobName, payload, options = {}) {
    const jobId = uuidv4();
    const job = {
      id: jobId,
      name: jobName,
      payload,
      status: 'queued',
      priority: options.priority || 'normal',
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date(),
      scheduledAt: options.scheduledAt || new Date(),
      startedAt: null,
      completedAt: null,
      failedAt: null,
      error: null,
      result: null,
      metadata: options.metadata || {}
    };

    this.jobs.set(jobId, job);
    this.stats.totalQueued++;

    // Process immediately if not scheduled
    if (!options.scheduledAt || new Date() >= options.scheduledAt) {
      setImmediate(() => this.processJob(jobId));
    } else {
      // Schedule for later
      const delay = options.scheduledAt - new Date();
      setTimeout(() => this.processJob(jobId), delay);
    }

    return job;
  }

  /**
   * Process a job
   */
  async processJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    if (job.status !== 'queued') return;

    const processor = this.processors.get(job.name);
    if (!processor) {
      job.status = 'failed';
      job.error = `No processor registered for job: ${job.name}`;
      job.failedAt = new Date();
      this.stats.totalFailed++;
      return;
    }

    job.status = 'processing';
    job.startedAt = new Date();
    job.attempts++;

    try {
      console.log(`Processing job: ${job.name} (${jobId})`);
      const result = await processor(job.payload, job);
      job.result = result;
      job.status = 'completed';
      job.completedAt = new Date();
      this.stats.totalProcessed++;
      console.log(`Job completed: ${job.name} (${jobId})`);
    } catch (error) {
      console.error(`Job failed: ${job.name} (${jobId})`, error);
      job.error = error.message;
      
      if (job.attempts < job.maxAttempts) {
        job.status = 'queued';
        // Retry with exponential backoff
        const delay = Math.pow(2, job.attempts) * 1000;
        setTimeout(() => this.processJob(jobId), delay);
      } else {
        job.status = 'failed';
        job.failedAt = new Date();
        this.stats.totalFailed++;
      }
    }
  }

  /**
   * Get job by ID
   */
  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status) {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  /**
   * Get jobs for a user
   */
  getUserJobs(userId) {
    return Array.from(this.jobs.values()).filter(
      job => job.metadata?.userId === userId
    );
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId) {
    const job = this.jobs.get(jobId);
    if (job && (job.status === 'queued' || job.status === 'processing')) {
      job.status = 'cancelled';
      return true;
    }
    return false;
  }

  /**
   * Retry a failed job
   */
  retryJob(jobId) {
    const job = this.jobs.get(jobId);
    if (job && job.status === 'failed') {
      job.status = 'queued';
      job.attempts = 0;
      job.error = null;
      setImmediate(() => this.processJob(jobId));
      return true;
    }
    return false;
  }

  /**
   * Get queue stats
   */
  getStats() {
    const jobs = Array.from(this.jobs.values());
    return {
      ...this.stats,
      queued: jobs.filter(j => j.status === 'queued').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      cancelled: jobs.filter(j => j.status === 'cancelled').length
    };
  }

  /**
   * Clean up old completed/failed jobs
   */
  cleanup(olderThanHours = 24) {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    let cleaned = 0;

    for (const [jobId, job] of this.jobs) {
      if (
        (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') &&
        (job.completedAt || job.failedAt) < cutoff
      ) {
        this.jobs.delete(jobId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Initialize global job queue
global.jobQueue = global.jobQueue || new JobQueueService();

/**
 * Pre-defined job types
 */

// Email job processor
global.jobQueue.registerProcessor('send_email', async (payload) => {
  console.log(`Sending email to ${payload.to}: ${payload.subject}`);
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 100));
  return { sent: true, messageId: uuidv4() };
});

// Notification job processor
global.jobQueue.registerProcessor('send_notification', async (payload) => {
  console.log(`Sending notification to user ${payload.userId}`);
  // Simulate notification
  await new Promise(resolve => setTimeout(resolve, 50));
  return { delivered: true };
});

// Analytics job processor
global.jobQueue.registerProcessor('process_analytics', async (payload) => {
  console.log(`Processing analytics for ${payload.event}`);
  // Simulate analytics processing
  await new Promise(resolve => setTimeout(resolve, 200));
  return { processed: true };
});

// Export job processor
global.jobQueue.registerProcessor('export_data', async (payload) => {
  console.log(`Exporting data: ${payload.format}`);
  // Simulate export
  await new Promise(resolve => setTimeout(resolve, 500));
  return { fileUrl: `/exports/${uuidv4()}.${payload.format}` };
});

// Cleanup job processor
global.jobQueue.registerProcessor('cleanup_old_data', async (payload) => {
  console.log(`Cleaning up data older than ${payload.days} days`);
  // Simulate cleanup
  await new Promise(resolve => setTimeout(resolve, 300));
  return { deletedCount: Math.floor(Math.random() * 100) };
});

module.exports = global.jobQueue;
