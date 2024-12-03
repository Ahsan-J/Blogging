import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENT_KEY = 'idempotent_key';
export const Idempotent = () => SetMetadata(IDEMPOTENT_KEY, true);