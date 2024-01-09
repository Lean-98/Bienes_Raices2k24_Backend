export class ValidationError extends Error {
  constructor(errors) {
    super('Validation Error')
    this.name = 'ValidationError'
    this.status = 400
    this.errors = errors
  }
}
