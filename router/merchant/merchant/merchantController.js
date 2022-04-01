const { ObjectID } = require("bson")
const bcrypt = require("bcrypt")
const httpStatus = require("http-status")

const { ProductModel } = require("../../../models/product")
const { MerchantModel } = require("../../../models/merchant")
const { MerchantAddressModel } = require("../../../models/merchantAddress")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const { jwtToken, parseJwt } = require("../../../utils/jwtToket")
const KEY = require("../../../utils/randamKey")
const helperService = require("../../../services/helper")
const { successResponse } = require("../../../response/success")

const signUp = async(req, res, next) => {
    data = req.item

    addressId = await KEY.random_key()
    getdata = await helperService.findQuery(MerchantModel, { email: data.email })

    if (getdata.length > 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.CONFLICT.status,
                errMsg: constents.EMAIL_EXIST
            },
            ""
        )
        res.status(httpStatus.CONFLICT).json(result)

    } else {
        let getdata = await helperService.insertQuery(MerchantModel, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            countryCode: data.countryCode,
            address: [ObjectID(addressId)],
            password: data.password
        })
        console.log(getdata)
        if (getdata.error) {
            result = await successResponse(
                true,
                null,
                httpStatus.OK, {
                    errCode: errors.INTERNAL_SERVER_ERROR.status,
                    errMsg: constents.INTERNAL_SERVER_ERROR
                },
                ""
            )
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
        }
        if (getdata.length > 0) {
            let { houseNo, colony, pinCode, city, state, country } = req.body.address
            let address = await helperService.insertQuery(MerchantAddressModel, {
                merchantId: getdata._id,
                houseNo: houseNo,
                colony: colony,
                pinCode: pinCode,
                city: city,
                state: state,
                country: country,
                _id: ObjectID(addressId),
            })
            if (address.error) {
                result = await successResponse(
                    true,
                    null,
                    httpStatus.OK, {
                        errCode: errors.INTERNAL_SERVER_ERROR.status,
                        errMsg: constents.INTERNAL_SERVER_ERROR
                    },
                    ""
                )
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
            }
            if (address.length > 0)
                result = await successResponse(
                    true, {
                        getdata,
                        address
                    },
                    httpStatus.OK,
                    "",
                    constents.MERCHENT_SIGNUP)
            res.status(httpStatus.OK).json(result)
        }
    }
}

const Login = async(req, res) => {
    data = req.body
    getdata = await helperService.findQuery(MerchantModel, { email: data.email, password: data.password })
    if (getdata.error) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.INTERNAL_SERVER_ERROR.status,
                errMsg: constents.INTERNAL_SERVER_ERROR
            },
            ""
        )
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    } else if (getdata == 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constents.INVALID_CRADENTIAL
            },
            ""
        )
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else {
        let token = jwtToken(getdata.email, "merchant")
        result = await successResponse(
            true, {
                _id: getdata[0]._id,
                fullName: getdata[0].firstName + " " + getdata[0].lastName,
                email: getdata[0].email,
                token: token
            },
            httpStatus.OK,
            "",
            constents.LOG_IN)
        res.status(httpStatus.OK).json(result)
    }
}

const profile = async(req, res, next) => {
    data = req.query
    qury = { _id: req.query.id }
    getdata = await helperService.populateQuery(MerchantModel, qury, field = ["address"])
    if (getdata.error) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.INTERNAL_SERVER_ERROR.status,
                errMsg: constents.INTERNAL_SERVER_ERROR
            },
            ""
        )
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    } else {
        result = await successResponse(
            true,
            getdata,
            httpStatus.OK,
            "",
            constents.MERCHANT_PROFILE
        )
        res.status(httpStatus.OK).json(result)
    }
}

const updateProfile = async(req, res, next) => {
    data = req.item
    id = req.query.id

    getdata = await helperService.updateByIdQuery(MerchantModel, ObjectID(id), data)
    if (getdata.error) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.INTERNAL_SERVER_ERROR.status,
                errMsg: constents.INTERNAL_SERVER_ERROR
            },
            ""
        )
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    }
    if (getdata == 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.DATA_NOT_FOUND.status,
                errMsg: constents.DATA_NOT_FOUND
            },
            ""
        )
        res.status(httpStatus.NOT_FOUND).json(result)
    } else {
        if (data.isDelete == true) {
            msg = constents.DELETE_ACCOUNT
        } else {
            msg = constents.MERCHANT_UPDATE
        }
        result = await successResponse(
            true, {
                email: getdata.email
            },
            httpStatus.OK,
            "",
            msg
        )
        res.status(httpStatus.OK).json(result)
    }
}


module.exports = {
    signUp,
    Login,
    profile,
    updateProfile,
}