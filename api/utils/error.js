export const errorHandler = (statusCode, message) => {
    const error = new Error(message);  // Assign message directly in constructor
    error.statusCode = statusCode;
    return error;
  };
  