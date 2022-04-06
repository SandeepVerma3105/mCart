const { ObjectID } = require("bson")
const bcrypt = require("bcrypt")
const httpStatus = require("http-status")

const { ProductModel } = require("../../models/product")
const { UserModel } = require("../../models/user")
const { UserAddressModel } = require("../../models/userAddress")
const { OtpModel } = require("../../models/otp")
const { CartModel } = require("../../models/cart")
const { AdminModel } = require("../../models/admin")
const { CategoryModel } = require("../../models/category")
const { BrandModel } = require("../../models/brand")
const { MerchantModel } = require("../../models/merchant")

const constents = require("../../constents/constent")
const errors = require("../../error/error")
const { jwtToken, parseJwt } = require("../../utils/jwtToket")
const KEY = require("../../utils/randamKey")
const helperService = require("../../services/helper")
const otp = require("../../utils/otp")
const { successResponse } = require("../../response/success")



const Login = async(req, res) => {
    data = req.body
    console.log(req.body)
    getdata = await helperService.findQuery(AdminModel, { email: data.email, password: data.password })
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
    } else if (getdata == 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.UNAUTHORIZED.status,
                errMsg: constents.INVALID_CREDENTIAL
            },
            ""
        )
        res.status(httpStatus.UNAUTHORIZED).json(result)
    } else {
        console.log(getdata)
        let token = jwtToken(getdata[0].email, getdata[0].role)
        result = await successResponse(
            true, {
                _id: getdata[0]._id,
                fullName: getdata.name,
                email: getdata[0].email,
                token: token
            },
            httpStatus.OK,
            "",
            constents.LOG_IN)
        res.status(httpStatus.OK).json(result)
    }
}


const forgetPaassword = async(req, res) => {
    data = req.item

    getOtp = await otp.getnerateOTP({ email: data.email })
    if (getOtp == 1) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.CONFLICT.status,
                errMsg: constents.OTP_ALLREADY_SENDED_EMAIL
            },
            ""
        )
        res.status(httpStatus.CONFLICT).json(result)
    }
    if (getOtp.errors) {
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
            true, { otp: getOtp[0].otp, phoneNumber: getOtp[0].phoneNumber },
            httpStatus.OK,
            "",
            constents.OTP_SENDED_EMAIL
        )
        res.status(httpStatus.CONFLICT).json(result)
    }
}

const addMerchant = async(req, res, next) => {
    data = req.item
    pass = await KEY.random_key()
    getdata = await helperService.findQuery(MerchantModel, { email: data.email })
    console.log(getdata)
    if (getdata.length > 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.CONFLICT.status,
                errMsg: constents.MERCHENT_EXIST
            },
            ""
        )
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    } else {
        let getdata = await helperService.insertQuery(MerchantModel, {
            firstName: data.firstName || "null",
            lastName: data.lastName || "null",
            email: data.email,
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber || 0,
            password: pass
        })
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
            console.log(getdata)
            result = await successResponse(
                true, {
                    username: getdata[0].email,
                    password: getdata[0].password
                },
                httpStatus.OK,
                "",
                constents.MERCHENT_SIGNUP)
            res.status(httpStatus.OK).json(result)
        }

    }
}

const blockMerchant = async(req, res) => {
    data = req.item
    console.log(data)
    getdata = await helperService.updateByIdQuery(MerchantModel, { _id: data.id }, { status: data.status })
    if (getdata.reason) {
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
        await helperService.updateQuery(ProductModel, { merchantId: data.id }, { status: data.status }).then(async(result) => {
            result = await successResponse(
                true, {
                    customer: getdata,
                },
                httpStatus.OK,
                "",
                constents.CHANGE_customer_STATUS
            )
            res.status(httpStatus.OK).json(result)
        }).catch(async(err) => {
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
        })

    }
}


const addCategory = async(req, res, next) => {
    data = req.item
    addressId = await KEY.random_key()
    getdata = await helperService.findQuery(CategoryModel, { name: data.name })
    if (getdata.length > 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.CONFLICT.status,
                errMsg: constents.CATEGORY_EXIST
            },
            ""
        )
        res.status(httpStatus.CONFLICT).json(result)
    }
    if (getdata == 0) {
        let getCatData = await helperService.insertQuery(CategoryModel, {
            name: data.name,
            description: data.description
        })
        if (getCatData.errors) {
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
        if (getCatData.length > 0)
            result = await successResponse(
                true, {
                    getCatData,

                },
                httpStatus.OK,
                "",
                constents.CATEGORY_ADDED)
        res.status(httpStatus.OK).json(result)
    }
}

const addBrand = async(req, res, next) => {
    data = req.item
    console.log(data)
    await helperService.findQuery(CategoryModel, { _id: req.item.categoryId }).then(async(result) => {
        if (result.length > 0) {
            getdata = await helperService.findQuery(BrandModel, { name: data.name })
            if (getdata.length > 0) {
                result = await successResponse(
                    true,
                    null,
                    httpStatus.OK, {
                        errCode: errors.CONFLICT.status,
                        errMsg: constents.BRAND_EXIST
                    },
                    ""
                )
                res.status(httpStatus.CONFLICT).json(result)
            }
            if (getdata == 0) {
                let getBrndData = await helperService.insertQuery(BrandModel, {
                    categoryId: data.categoryId,
                    name: data.name,
                    description: data.description
                })
                if (getBrndData.errors) {
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
                if (getBrndData.length > 0)
                    result = await successResponse(
                        true,
                        getBrndData[0],

                        httpStatus.OK,
                        "",
                        constents.BRAND_ADDED)
                res.status(httpStatus.OK).json(result)
            }
        }
    }).catch(async(err) => {
        console.log(err)
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
    })
}



module.exports = {
    forgetPaassword,
    Login,
    addMerchant,
    addCategory,
    addBrand,
    blockMerchant
}