import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidInstanceofException extends HttpException {
  constructor(className: string) {
    super(`Instance is not a member of class ${className}`, HttpStatus.FORBIDDEN);
  }
}