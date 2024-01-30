
interface IStandardErrorConstructor {
  message: string;
  error_code: number;
}

export class StandardError extends Error {
  public readonly error_code: number;
  
  constructor({ message, error_code}: IStandardErrorConstructor) {
    super(message)
    this.error_code = error_code
  }
}