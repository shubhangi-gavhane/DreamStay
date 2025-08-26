const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.alternatives().try(
      Joi.string().allow('', null),
      Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().required()
      })
    ).optional(),
    category: Joi.string()
      .valid(
        "Trending",
        "Rooms",
        "Iconic cities",
        "Mountains",
        "Castles",
        "Amazing pools",
        "Camping",
        "Farms",
        "Arctic Pools"
      )
      .required(),
  }).required()
});
