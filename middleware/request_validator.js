const httpStatus = require("http-status");
const Joi = require("joi");
const { head } = require("lodash")
const errors = require("../error/error")
const { successResponse } = require("../response/success")
const constents = require("../constents/constent")
const requestValidator = (schema, property = "body") => async(req, res, next) => {
    data = req[property]
    try {
        req.item = await Joi.validate(data, schema, {
            stripUnknown: { objects: true, arrays: true },
            convert: true,
            abortEarly: false
        });
    } catch (err) {
        if (err.details) {
            err.message = head(err.details).message;
        } else {
            console.log('Schema error');
        }
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.BAD_REQUEST.status,
                errMsg: err.message
            },
            ""
        )
        res.status(httpStatus.BAD_REQUEST).json(result)
        return next([err.message]);
    }
    if (Object.keys(data).length > 0) {
        return next();
    } else {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.BAD_REQUEST.status,
                errMsg: constents.EMPTY_FIELDS
            },
            ""
        )
        res.status(httpStatus.BAD_REQUEST).json(result)
        return next([constents.EMPTY_FIELDS]);
    }

}

module.exports = { requestValidator };