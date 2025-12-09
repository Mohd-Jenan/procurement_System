const Joi = require("joi")

const schema= Joi.object({
      name:Joi.string().min(3).max(30).required(),
      email:Joi.string().email().required(),
      mobile:Joi.string().pattern(/^[0-9]{10}$/).optional(),
      password:Joi.string().min(6).required(),
      role:Joi.string().required(),
      assignedTo: Joi.number().optional().allow(null)
    })

    module.exports=schema