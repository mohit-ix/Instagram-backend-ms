const validateBody = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body, {abortEarly: false});
    
    if(error) {
        res.status(500).send({
            status: "failure",
            message: "Schema incorrect"
        })
    }

    return next();
};

const validateParams = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.params, {abortEarly: false});
    
    if(error) {
        res.status(500).send({
            status: "failure",
            message: "Schema incorrect"
        })
    }

    return next();
};

module.exports = {
    validateBody,
    validateParams
}