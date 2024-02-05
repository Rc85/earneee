export class HttpException extends Error {
  status: number;
  message: string;
  details: any;
  origin: string = 'oobooroo-error';

  constructor(err?: any, status: any = 500, message: any = 'An error occurred') {
    super();

    if (arguments.length === 1) {
      if (typeof arguments[0] === 'number') {
        status = arguments[0];
      }
    } else if (arguments.length === 2) {
      if (typeof arguments[0] === 'number') {
        status = arguments[0];
      }

      if (typeof arguments[1] === 'string') {
        message = arguments[1];
      }

      err = 'application';
    } else if (arguments.length === 3) {
      status = arguments[0];
      message = arguments[1];

      this.details = arguments[2];
    }

    this.status = status;
    this.message = message;
  }
}
