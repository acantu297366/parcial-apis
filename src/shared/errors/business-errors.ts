export class BusinessLogicException {
  message: string;
  type: BusinessError;
  constructor(message: string, type: number) {
    this.message = message;
    this.type = type;
  }
}

export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}
