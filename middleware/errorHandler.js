const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message,
    });
};

export default errorHandler;
