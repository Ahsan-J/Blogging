export type NodemailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export type SendEmailRequest<T> = {
  from: string, 
  to: string, 
  subject: string, 
  template: string
  data: T
}