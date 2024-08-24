const validate = (schema) => async (req, res, next) => {
    try {

        // Validate and parse the request body
        const parsedBody = await schema.parseAsync(req.body);

        // Assign parsed body back to the request object
        req.body = parsedBody;

        // Proceed to the next middleware/controller
        next();
    } catch (err) {
        // If validation fails, send a 400 Bad Request with the error message
        res.status(400).json({ error: err.errors[0].message });
    }
};

module.exports = {validate};