const Joi = require("joi");
const { objectId } = require("./custom.validation");

const singleIdSchema = Joi.object({
    id: Joi.string().custom(objectId).required(),
});

const multiIdSchema = Joi.object({
    uniqueUser: Joi.array().items(Joi.string.custom(objectId)).required()
});

const usernameSchema = Joi.object({
    username: Joi.array().required(),
})

module.exports = {
    singleIdSchema,
    multiIdSchema,
    usernameSchema,
}