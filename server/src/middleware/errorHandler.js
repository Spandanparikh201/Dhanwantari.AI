const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error structure
    const error = {
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An unexpected error occurred'
        }
    };

    // Handle specific error types
    if (err.name === 'ValidationError') {
        error.error.code = 'VALIDATION_ERROR';
        error.error.details = err.details;
        return res.status(400).json(error);
    }

    if (err.name === 'UnauthorizedError' || err.code === 'UNAUTHORIZED') {
        error.error.code = 'UNAUTHORIZED';
        return res.status(401).json(error);
    }

    if (err.code === 'NOT_FOUND') {
        return res.status(404).json(error);
    }

    // Default to 500
    res.status(err.statusCode || 500).json(error);
};

module.exports = errorHandler;
