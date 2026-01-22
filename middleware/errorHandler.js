// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Ensure we have an error object
  if (!err) {
    return next();
  }

  let error = { ...err };
  error.message = err.message;

  // Log error with full details
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Mongoose connection error
  if (err.name === 'MongoServerError' || err.name === 'MongooseError') {
    error = { 
      message: 'Database connection error. Please try again later.', 
      statusCode: 500 
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = { 
      message: err.message || 'Invalid or expired token', 
      statusCode: 401 
    };
  }

  // Ensure response hasn't been sent
  if (!res.headersSent) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } else if (next) {
    // If headers already sent, pass to default Express error handler
    next(err);
  }
};

// Async handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (next) {
        next(err);
      } else {
        console.error('Error in asyncHandler - next is not available:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: err.message || 'Internal Server Error'
          });
        }
      }
    });
  };
};
