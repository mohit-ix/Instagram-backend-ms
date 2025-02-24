const Joi = require("joi");
const { objectId } = require("./custom.validation");

const homepageSchema = Joi.object({
    followings: Joi.array().items(Joi.string().custom(objectId)),
    userId: Joi.string().custom(objectId),
});

const postSchema = Joi.object({
    imageUrl: Joi.string().required(),
    description: Joi.string().max(50).required(),
});

const userIdSchema = Joi.object({
    id: Joi.string().custom(objectId),
});

const postIdSchema = Joi.object({
    id: Joi.string().custom(objectId),
})

module.exports = {
    homepageSchema,
    postSchema,
    userIdSchema,
    postIdSchema
}