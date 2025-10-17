import { ApiError } from './api-error'

export class ConflictError extends ApiError {
  public statusCode = 409

  constructor(message = 'Conflict', options?: { cause?: Error }) {
    super(message, options)
  }
}
