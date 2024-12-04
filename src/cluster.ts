import { Logger } from "@nestjs/common";
import cluster from 'cluster';
import os from 'os';

const logger = new Logger()

export function RunInClusterMode(cb: (() => void), clusterCount = (os.cpus().length / 2)): void {
    if (cluster.isPrimary) {
        logger.log(`Master ${process.pid} is running`);

        for (let i = 0; i < clusterCount; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            logger.log(`Worker ${worker.process.pid} died`);
            cluster.fork();
        });

    } else {
        cb();
    }
}