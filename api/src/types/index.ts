import type { User } from '../../../shared/types.js'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export interface ValidationError extends Error {
  statusCode: number
  code?: string
}

export function createError(
  message: string,
  statusCode: number = 400,
  code?: string,
): ValidationError {
  const error = new Error(message) as ValidationError
  error.statusCode = statusCode
  error.code = code
  return error
}
