export {};

declare global {
    namespace Express {
      interface Request {
        auth: {[key in string]: string}
      }
    }
  }