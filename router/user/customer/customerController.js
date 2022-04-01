const { ObjectID } = require("bson")
const bcrypt = require("bcrypt")
const httpStatus = require("http-status")

const { ProductModel } = require("../../../models/product")
const { UserModel } = require("../../../models/user")
const { UserAddressModel } = require("../../../models/userAddress")
const { OtpModel } = require("../../../models/otp")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const { jwtToken, parseJwt } = require("../../../utils/jwtToket")
const KEY = require("../../../utils/randamKey")
const helperService = require("../../../services/helper")
const otp = require("../../../utils/otp")
const { successResponse } = require("../../../response/success")

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
            console.log("hdhashda", data.houseNo)
            let addresses = await helperService.insertQuery(UserAddressModel, {
                merchantId: getUserData._id,
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
                errMsg: constents.INVALID_CRADENTIAL
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
            console.log(getdata)
            let token = jwtToken(getdata.phoneNumber, "merchant")
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
}
const getnerateOTP = async(req, res) => {
    data = req.item
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
        res.status(httpStatus.CONFLICT).json(result)
    }
}


module.exports = {
    signUp,
    signIn,
    getnerateOTP
}