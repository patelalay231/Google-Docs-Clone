// error-handler.js
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).send({ error: message });
};


module.exports = {errorHandler};
