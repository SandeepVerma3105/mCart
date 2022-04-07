require('dotenv').config()
const httpStatus = require("http-status")
const jwt = require('jsonwebtoken');
const constent = require('../constents/constent');
const secretKey = process.env.SECRET_KEY
const errors = require('../error/error')
const jwtDecode = require("jwt-decode")
const { successResponse } = require("../response/success")

//verify token 
function verifyToken(req, res, next) {
    let token = req.headers['accesstoken'];
    console.log("TCL: verifyToken -> token", token)
    if (!token) return res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        error: httpStatus.UNAUTHORIZED + " UNAUTHORIZED",
        message: "no token provided"
    });
    jwt.verify(token, secretKey, async function(error, decoded) {
        if (error) {
            console.log('------------>Token ERROR', error);
            result = await successResponse(
                true,
                null,
                httpStatus.OK, {
                    errCode: errors.UNAUTHORIZED.status,
                    errMsg: constent.TOKEN_EXPIRE
                },
                ""
            )
            res.status(httpStatus.UNAUTHORIZED).json(result)
        } else {
            req.tokenData = {
                id: decoded.id,
                email: decoded.email,
                token: token
            }
            console.log('------------------>>token verified')
            next();
        }
    });
}

//valiation for merchant to access apis
async function parseJwtMerchent(req, res, next) {
    let token = req.headers['accesstoken']
    const tokenData = jwtDecode(token)
    req.tokenData = tokenData
    if (tokenData.role != "merchant" && tokenData.role != "admin") {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constent.MERCHANT_VALIDATION
            },
            ""
        )
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else {
        next()
    }
}

//valiation for admin to access apis
async function parseJwtAdmin(req, res, next) {
    let token = req.headers['accesstoken']
    const tokenData = jwtDecode(token)
    req.tokenData = tokenData
    if (tokenData.role != "admin") {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constent.ADMIN_VALIDATION
            },
            ""
        )
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else {
        next()
    }
}

async function parseJwtCustomer(req, res, next) {
    let token = req.headers['accesstoken']
    tokenData = jwtDecode(token)
    req.tokenData = tokenData
    console.log("dfdd", tokenData)
    if (tokenData.role != "customer" && tokenData.role != "admin") {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constent.CUSTOMER_VALIDATION
            },
            ""
        )
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else {
        return next()
    }
}

module.exports = {
    verifyToken,
    parseJwtMerchent,
    parseJwtAdmin,
    parseJwtCustomer
}