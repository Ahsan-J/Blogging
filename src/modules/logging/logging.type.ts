import { Log } from "./logging.entity";

export interface ICreateLog {
    message: Log['message'];
    route: Log['route'];
    data: Log['data'];
    file_path: Log['file_path'];
}