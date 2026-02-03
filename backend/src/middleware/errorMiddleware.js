const errorMiddleware = (err, req, res, next) => {
    console.error("ERROR:", err.message);

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            message: "Validation failed",
            errors
        });
    }
    // Mongoose duplicate key (email taken)
    if (err.code === 11000) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }
    // JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
    // Default
    res.status(500).json({
        message: "Something went wrong"
    });
};

module.exports = errorMiddleware;
