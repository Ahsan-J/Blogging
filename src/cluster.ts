import { Logger } from "@nestjs/common";
import cluster from 'cluster';
import os from 'os';

const logger = new Logger()

const LOAD_THRESHOLD = 1.5;
const numCPUs = os.cpus().length;
let currentWorkers = 0;

function getSystemLoad() {
    const loadAvg = os.loadavg();
    return loadAvg[0]; // Return the 1-minute load average
}

function manageWorkers() {
    const currentLoad = getSystemLoad();
    
    // If the current load exceeds the threshold and there are fewer workers than the available CPU cores
    if (currentLoad > LOAD_THRESHOLD && currentWorkers < numCPUs) {

        logger.log(`High load detected! Spawning a new worker... (Load: ${currentLoad})`);
        cluster.fork();
        currentWorkers++;

    } else if (currentLoad <= LOAD_THRESHOLD && currentWorkers > 1) {

        logger.log(`Load is low, reducing workers... (Load: ${currentLoad})`);
        // Kill the last worker
        if (!cluster.workers) return logger.log(`Worker not available`, cluster.workers)
        const workerIds = Object.keys(cluster.workers);
        const workerToKill = workerIds[workerIds.length - 1];
        cluster.workers[workerToKill]?.kill();

    }
}

export function RunInClusterMode(cb: (() => void)): void {
    if (cluster.isPrimary) {
        cluster.fork();
        currentWorkers++;

        setInterval(manageWorkers, 5000);

        cluster.on('exit', (worker) => {
            logger.log(`Worker ${worker.process.pid} died`);
            currentWorkers--;
        });

    } else {
        return cb();
    }
}