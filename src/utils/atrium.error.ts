import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../errors'

export const AtriumErrors = (error: any) => {
  if (error.response?.status === 409) {
    throw new ConflictError(error.response?.data?.message)
  } else if (error.response?.status === 400 || 403) {
    throw new BadRequestError(error.response?.data?.message)
  } else if (error.response?.status === 404) {
    throw new NotFoundError(error.response?.data?.message)
  } else {
    throw new InternalServerError('Atrium registration failed')
  }
}
