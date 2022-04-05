const { ObjectID } = require("bson")
const bcrypt = require("bcrypt")
const httpStatus = require("http-status")

const { ProductModel } = require("../../../models/product")
const { UserModel } = require("../../../models/user")
const { UserAddressModel } = require("../../../models/userAddress")
const { OtpModel } = require("../../../models/otp")
const { CartModel } = require("../../../models/cart")
const { PaymentModel } = require("../../../models/payment")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const { jwtToken, parseJwt } = require("../../../utils/jwtToket")
const KEY = require("../../../utils/randamKey")
const helperService = require("../../../services/helper")
const otp = require("../../../utils/otp")
const { successResponse } = require("../../../response/success")
const { OrderDetailModel } = require("../../../models/orderDetail")
const req = require("express/lib/request")
const { AllOrderDetailModel } = require("../../../models/allOrderDetail")



const paymentDetail = async(req, res, next) => {
    data = req.item
    getUserData = await helperService.findQuery(UserModel, { _id: ObjectID(data.userId) })
    if (getUserData.length > 0) {
        getCardData = await helperService.findQuery(PaymentModel, { cardNo: data.cardNo })
        if (getCardData.length > 0) {
            result = await successResponse(
                true,
                null,
                httpStatus.OK, {
                    errCode: errors.CONFLICT.status,
                    errMsg: constents.CARD_EXIST
                },
                ""
            )
            res.status(httpStatus.CONFLICT).json(result)
        } else {
            paymentKey = await KEY.random_key()
            let getdata = await helperService.insertQuery(PaymentModel, {
                userId: data.id,
                cardNo: data.cardNo,
                cardName: data.cardName,
                cardHolderName: data.cardHolderName,
                cvvNo: data.cvvNo,
                expDate: data.expDate,
                paymentKey: paymentKey,
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
                result = await successResponse(
                    true, {
                        getdata,

                    },
                    httpStatus.OK,
                    "",
                    constents.CARD_ADDED)
                res.status(httpStatus.OK).json(result)
            }
        }
    } else {
        result = await successResponse(
            true, "",
            httpStatus.OK, {
                errCode: errors.BAD_REQUEST.status,
                errMsg: constents.USER_NOT_EXIST
            },
            ""
        )
        res.status(httpStatus.OK).json(result)
    }
}

const paymentList = async(req, res, next) => {
    data = req.query
    getdata = await helperService.findQuery(PaymentModel, { userId: data.userId })
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
        res.status(httpStatus.OK).json({
            success: true,
            status: httpStatus.OK + " OK",
            data: getdata
        })
    }
}

const updatepayment = async(req, res, next) => {
    data = req.body
    qury = req.query.id
    getdata = await helperService.updateByIdQuery(PaymentModel, ObjectID(qury), data)
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
                errMsg: constents.INVALID_ID
            },
            ""
        )
        res.status(httpStatus.NOT_FOUND).json(result)

    } else {
        result = await successResponse(
            true, {
                getUserData,

            },
            httpStatus.OK,
            "",
            constents.CARD_DETAIL_UPDATED)
        res.status(httpStatus.OK).json(result)
    }
}

const deletepayment = async(req, res, next) => {
    data = req.params.id
    getdata = await PaymentModel.deleteOne({ _id: ObjectID(data) })
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
                errMsg: constents.INVALID_ID
            },
            ""
        )
        res.status(httpStatus.NOT_FOUND).json(result)
    } else {
        result = await successResponse(
            true, "",
            httpStatus.OK,
            "",
            constents.CARD_DELETED)
        res.status(httpStatus.OK).json(result)
    }
}

const makePayment = async(req, res) => {
    data = req.body
    userId = req.query.userId
    field = [
        { path: "productId", model: "product" },
        { path: "userId", model: "user", select: ["_id", "firstName", "lastName"] },
        { path: "userAddressId", model: "userAddress", select: ["_id", "houseNo", "state", "pinCode"] },
    ]
    transectionId = await KEY.random_key()
    await helperService.populateQuery(OrderDetailModel, { userId: userId, _id: data.orderId }, field)

    .then(async(result) => {
        totalAmount = (result[0].baseCost * result[0].unit) + ((result[0].baseCost * result[0].unit) * result[0].discount) / 100
        console.log(result)
        if (result != 0) {
            data = {
                orderId: data.orderId,
                userId: userId,

                productId: result[0].productId._id,
                productName: result[0].productId.name,
                baseCost: result[0].baseCost,
                discount: result[0].discount,
                unit: result[0].unit,
                address: {
                    houseNo: result[0].userAddressId.houseNo,
                    state: result[0].userAddressId.state,
                    pincode: result[0].userAddressId.pincode,
                    city: result[0].userAddressId.pincode,
                },
                transectionStatus: true,
                transectionId: transectionId,
                totalAmount: totalAmount
            }
            await helperService.insertQuery(AllOrderDetailModel, data).then(async(resultdata) => {
                if (result.error) {
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
                        true, {
                            resultdata,
                        },
                        httpStatus.OK,
                        "",
                        constents.PAYMENT_SUCCESSFULL)
                    res.status(httpStatus.OK).json(result)
                }
            })
        } else {
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

    }).catch(async err => {
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
    paymentDetail,
    paymentList,
    deletepayment,
    updatepayment,
    makePayment
}