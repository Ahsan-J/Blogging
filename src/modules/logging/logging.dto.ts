import { Log } from "./logging.entity";

export class LogResponse {
    constructor(
        private log: Log
    ) {}

    get id () { return this.log.id; }
    get data () { return this.log.data; }
    get route () { return this.log.route; }
    get message () { return this.log.message; }
    get createdAt () { return this.log.createdAt; }
}