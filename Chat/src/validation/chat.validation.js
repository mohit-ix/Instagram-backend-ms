const Joi = require("joi");
const { objectId } = require("./custom.validation");

const userIdSchema = Joi.object({
    id: Joi.string().custom(objectId),
});

module.exports = {
    userIdSchema
}