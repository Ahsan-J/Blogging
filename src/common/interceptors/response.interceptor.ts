import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AppResponse, PaginatedAppResponse } from "../dto/response.dto";
import { Request, Response } from "express";
import { ObjectType } from "../types/collection.type";

@Injectable()
export class AppResponseInterceptor<T extends (ObjectType | Array<ObjectType>)> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<AppResponse<T>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (res.get('Content-Type')?.includes('text/html') || req.accepts('html')) {
      return next.handle();
    }

    return next.handle().pipe(
      map(data => {
        if(data && typeof data != "object") return data
        const response = new AppResponse<T>(data, "", res.statusCode, res.statusMessage)
        if ("data" in data && 'meta' in data) {
          const response = new AppResponse<T>(data.data as T, "", res.statusCode, res.statusMessage)
          return new PaginatedAppResponse<T>(response, data.meta);
        }
        return response
      }),
    );
  }
}