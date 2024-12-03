import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IDEMPOTENT_KEY } from '@/common/decorator/idempotent.decorator';
import { ICacheManager } from '@/common/interface/cache-manager.interface';
import { ObjectType } from '../types/collection.type';
import { Request } from 'express';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    constructor(
        private readonly cacheManager: ICacheManager<ObjectType>,
        private readonly reflector: Reflector
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<ObjectType> {
        const handler = context.getHandler();
        const isIdempotent = this.reflector.get<boolean>(IDEMPOTENT_KEY, handler);

        if (!isIdempotent) return next.handle();

        const request = context.switchToHttp().getRequest<Request>();
        const idempotencyKey = request.headers['x-request-id'] as string;

        if (!idempotencyKey) throw new BadRequestException("'x-request-id' is required");

        const existingRecord = this.cacheManager.get(idempotencyKey);

        if (existingRecord) {
            return new Observable((subscriber) => {
                subscriber.next(existingRecord);
                subscriber.complete();
            });
        }
        
        return next.handle().pipe(
            tap((result: ObjectType) => {
                this.cacheManager.save(idempotencyKey, result);
            })
        );
    }
}