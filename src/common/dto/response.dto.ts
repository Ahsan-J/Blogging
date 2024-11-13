export class AppResponse<T = any> {
    
    status: number;
    data: T;
    message: string;
    code: string;

    constructor(data: T, code = "", status = 200, message = "Success") {
        this.status = status;
        this.message = message;
        this.code = code;
        this.data = data;
    }
}