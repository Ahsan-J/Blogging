import { ObjectType } from "../types/collection.type";
import { PaginationMeta } from "./pagination.dto";

export class AppResponse<T extends (ObjectType | Array<ObjectType>)> {
    
    constructor(
        public data: T, 
        public readonly code = "", 
        public readonly status = 200, 
        public readonly message = "Success",
    ) {

        if(data && typeof data == "object" && '0' in data) 
            data = Object.values(data) as T; // converting object to array
  
    }
}

export class PaginatedAppResponse<T extends (ObjectType | Array<ObjectType>)> extends AppResponse<T> {
    
    constructor(
        response: AppResponse<T>, 
        public readonly meta: PaginationMeta | undefined = undefined
    ) {
        super(response.data,response.code, response.status, response.message);
    }

}