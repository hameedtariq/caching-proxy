class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }

  static badRequest(message: string) {
    return new ApiError(message, 400);
  }

  static unauthorized(message: string) {
    return new ApiError(message, 401);
  }

  static forbidden(message: string) {
    return new ApiError(message, 403);
  }

  static notFound(message: string) {
    return new ApiError(message, 404);
  }

  static internal(message: string) {
    return new ApiError(message, 500);
  }

  static serviceUnavailable(message: string) {
    return new ApiError(message, 503);
  }
}

export default ApiError;
