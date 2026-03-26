export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, userMessage?: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', userMessage || error.message);
  }

  return new AppError(
    String(error),
    'UNKNOWN_ERROR',
    userMessage || 'An unexpected error occurred'
  );
}

export function logError(error: unknown, context?: string): void {
  const appError = handleError(error);
  
  console.error(`[${context || 'Error'}]:`, {
    message: appError.message,
    code: appError.code,
    userMessage: appError.userMessage,
    stack: appError.stack,
  });
}
