const { ObjectID } = require("bson")
const bcrypt = require("bcrypt")
const httpStatus = require("http-status")

const { ProductModel } = require("../../../models/product")
const { UserModel } = require("../../../models/user")
const { UserAddressModel } = require("../../../models/userAddress")
const { OtpModel } = require("../../../models/otp")
const { CartModel } = require("../../../models/cart")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const { jwtToken, parseJwt } = require("../../../utils/jwtToket")
const KEY = require("../../../utils/randamKey")
const helperService = require("../../../services/helper")
const otp = require("../../../utils/otp")
const { successResponse } = require("../../../response/success")
const { OrderDetailModel } = require("../../../models/orderDetail")
const { toInteger } = require("lodash")

const signUp = async(req, res, next) => {
    data = req.item
    addressId = await KEY.random_key()
    console.log(data.phoneNumber)
        //insert customer detail in user table
    getdata = await helperService.findQuery(UserModel, { phoneNumber: data.phoneNumber })
    if (getdata.length > 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.CONFLICT.status,
                errMsg: constents.PHONE_NUMBER_EXIST
            },
            ""
        )
        res.status(httpStatus.CONFLICT).json(result)
    }
    if (getdata == 0) {
        let getUserData = await helperService.insertQuery(UserModel, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            countryCode: data.countryCode,
            address: [ObjectID(addressId)],
            password: data.password
        })
        if (getUserData.errors) {
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
        if (getUserData.length > 0) {

            let { houseNo, colony, pinCode, city, state, country } = req.body.address
            let addresses = await helperService.insertQuery(UserAddressModel, {
                userId: getUserData._id,
                houseNo: houseNo,
                colony: colony,
                pinCode: pinCode,
                city: city,
                state: state,
                country: country,
                _id: ObjectID(addressId),
            })
            if (addresses.errors) {
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
                return
            }
            if (addresses.length > 0)
                getUserData[0].address = addresses
            result = await successResponse(
                true, {
                    getUserData,

                },
                httpStatus.OK,
                "",
                constents.CUSTOMER_SIGNUP)
            res.status(httpStatus.OK).json(result)

        }
    }
}

const signIn = async(req, res) => {
    data = req.body
    getdata = await helperService.findQuery(UserModel, { phoneNumber: data.phoneNumber })
    if (getdata.errors) {
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
        getdata = await helperService.findQuery(OtpModel, { phoneNumber: data.phoneNumber, otp: data.otp })
        if (getdata.errors) {
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
                    errMsg: constents.OTP_EXPIRED
                },
                ""
            )
            res.status(httpStatus.UNAUTHORIZED).json(result)
        } else {
            let token = jwtToken(getdata[0].phoneNumber, "customer", getdata[0]._id)
            await OtpModel.remove({ phoneNumber: getdata[0].phoneNumber })
            result = await successResponse(
                true, {
                    _id: getdata[0]._id,
                    phoneNumber: getdata[0].phoneNumber,
                    token: token
                },
                httpStatus.OK,
                "",
                constents.LOG_IN)
            res.status(httpStatus.OK).json(result)
        }
    }
}
const getnerateOTP = async(req, res) => {
    data = req.item
    getdata = await helperService.findQuery(UserModel, { phoneNumber: data.phoneNumber })

    getOtp = await otp.getnerateOTP({ phoneNumber: data.phoneNumber })
    if (getOtp == 1) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.CONFLICT.status,
                errMsg: constents.OTP_ALLREADY_SENDED
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
            constents.OTP_SENDED
        )
        res.status(httpStatus.OK).json(result)
    }
}

const updateAddress = async(req, res) => {
    data = req.item
    id = req.query.addressId
    getdata = await helperService.updateQuery(MerchantAddressModel, { _id: id, merchantId: req.tokenData.id }, data)
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
        result = await successResponse(
            true,
            "",
            httpStatus.OK,
            "",
            constents.ADDRESS_UPDATED
        )
        res.status(httpStatus.OK).json(result)
    }
}

const addAddress = async(req, res) => {
    data = req.body
    addressId = await KEY.random_key()
    await helperService.insertQuery(MerchantAddressModel, {
        merchantId: req.tokenData.id,
        houseNo: data.houseNo,
        colony: data.colony,
        pinCode: data.pinCode,
        city: data.city,
        state: data.state,
        country: data.country,
        _id: ObjectID(addressId)
    }).then(async(resultData) => {
        adId = resultData[0].id
        await helperService.updateByIdQuery(MerchantModel, req.tokenData.id, { $push: { address: { _id: adId } } }).then(async(resultData) => {
            result = await successResponse(
                true,
                resultData,
                httpStatus.OK, "",
                constents.ADDRESS_ADDED
            )
            res.status(httpStatus.OK).json(result)
        })
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



const getProduct = async(req, res) => {
    req.query.isDelete = false
    req.query.status = false
    console.log(req.query)
    let field = [
        { path: "categoryId", model: "category", select: ["name"] },
        { path: "brandId", model: "brand", select: ["_id", "name"] },
    ]
    data = req.query
    if (!req.query) {
        req.body = req.body
    }

    if (req.query.productId) {
        req.query._id = req.query.productId
    }
    if (req.query.globalSearchString) {
        req.query.$text = { $search: req.query.globalSearchString }
    }
    if (req.query.searchString) {
        req.query.name = { $regex: '.*' + req.query.searchString + '.*', "$options": 'i' }

    }
    getdata = await helperService.populateQuery(ProductModel, req.query, field)
    if (getdata == 0) {
        result = await successResponse(
            true, { data: [], count: 0 },
            httpStatus.OK,
            "",
            constents.PRODUCT_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
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
        result = await successResponse(
            true, { data: getdata, count: getdata.count },
            httpStatus.OK,
            "",
            constents.PRODUCT_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const addCart = async(req, res) => {
    data = req.item
        // data.userId = req.query.userId
    getData = await helperService.findQuery(ProductModel, { _id: data.productId })
    if (getData == 0) {
        result = await successResponse(
            true, "",
            httpStatus.NOT_FOUND, {
                errCode: errors.DATA_NOT_FOUND.status,
                errMsg: constents.DATA_NOT_FOUND
            },
            ""
        )
        res.status(httpStatus.OK).json(result)
    }
    if (getData[0].unit >= data.unit) {
        getdata = await helperService.insertQuery(CartModel, {
            userId: req.tokenData.id,
            productId: data.productId,
            unit: data.unit,
            baseCost: data.baseCost,

        })
        result = await successResponse(
            true, getdata,
            httpStatus.OK,
            "",
            constents.ADD_CART
        )
        res.status(httpStatus.OK).json(result)

    }
    if (getData[0].unit < data.unit) {
        result = await successResponse(
            true, {
                productQuantity: getData[0].unit,
                orderQuantity: data.unit
            },
            httpStatus.OK, {
                errCode: errors.BAD_REQUEST.status,
                errMsg: constents.QUANTITY
            },
            ""
        )
        res.status(httpStatus.OK).json(result)
    }
    if (getData.errors) {
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


}

const placeOrder = async(req, res) => {
    data = req.item
    getData = await helperService.findQuery(ProductModel, { _id: data.productId })
    console.log(data, getData)
    if (getData.length > 0 && getData[0].unit >= data.unit) {
        getdata = await helperService.insertQuery(OrderDetailModel, {
            userId: req.tokenData.id,
            productId: data.productId,
            unit: data.unit,
            discount: getData[0].discount,
            baseCost: getData[0].baseCost,
            userAddressId: data.addressId,
            merchantId: getData[0].merchantId

        })
        if (getdata.errors) {
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
            return
        }
        if (getdata.length > 0)
            unit = getData[0].unit - data.unit
        updateQuantity = await helperService.updateQuery(ProductModel, { _id: data.productId }, { unit: unit })
            .then(async() => {
                deleteData = await CartModel.deleteOne({ _id: data.productId, userId: req.tokenData.id })
            })
            .then(async() => {
                result = await successResponse(
                    true, {
                        getdata,

                    },
                    httpStatus.OK,
                    "",
                    constents.ORDER_PLACED)
                res.status(httpStatus.OK).json(result)
            })

    }
    if (getData.length > 0 && getData[0].unit < data.unit) {
        result = await successResponse(
            true, {
                productQuantity: getData[0].unit,
                orderQuantity: data.unit
            },
            httpStatus.OK, {
                errCode: errors.BAD_REQUEST.status,
                errMsg: constents.QUANTITY
            },
            ""
        )
        res.status(httpStatus.OK).json(result)
    }
    if (getData == 0) {
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
    }
    if (getData.errors) {
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
}

const trackOrder = async(req, res) => {
    data = req.item
    data.orderStatus != 5
    field = [
        { path: "userId", model: "user", select: ["_id", "firstName", "lastName", "email"] },
        { path: "productId", model: "product", select: ["name"] },
        { path: "userAddressId", model: "userAddress" },
        { path: "merchantId", model: "merchant" }
    ]
    getdata = await helperService.populateQuery(OrderDetailModel, { userId: req.tokenData.id }, field)
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
            true, { data: getdata, count: getdata.count },
            httpStatus.OK,
            "",
            constents.PRODUCT_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const orderHistory = async(req, res) => {
    data = req.item
    field = [
        { path: "produtId", model: "product", select: ["_id", "name", "description", "longDescription"] },
    ]
    getdata = await helperService.populateQuery(OrderDetailModel, { userId: req.tokenData.id })
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
            true, { data: getdata, count: getdata.count },
            httpStatus.OK,
            "",
            constents.PRODUCT_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const updateUnit = async(req, res) => {
    data = req.body
    await helperService.findQuery(CartModel, { userId: req.tokenData.id, productId: data.productId })
        .then(async(result) => {
            if (result.length > 0) {
                unit = result[0].unit + data.unit
                await helperService.updateByIdQuery(CartModel, result[0]._id, { unit: unit })
                    .then(async(result) => {
                            result = await successResponse(
                                true, {
                                    result,

                                },
                                httpStatus.OK,
                                "",
                                constents.UPDATE_QUANTITY)
                            res.status(httpStatus.OK).json(result)
                        }

                    ).catch(async() => {
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
            } else {
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
        })
}




module.exports = {
    signUp,
    signIn,
    getnerateOTP,
    getProduct,
    addCart,
    placeOrder,
    trackOrder,
    orderHistory,
    updateUnit
}