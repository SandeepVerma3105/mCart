const helperService = require("../services/helper")
const crypto = require('crypto');
const { OtpModel } = require("../models/otp")

//function generate five digit random number
const getOtp = async(key) => {
    key = await Math.floor(Math.random() * 90000) + 10000;
    return key
}

//function to generate otp and also insert into collection for respective phone number
const getnerateOTP = async(data) => {
    let otp = await getOtp()
    getdata = await helperService.findQuery(OtpModel, data)
    if (getdata == 0) {
        insertOtp = await helperService.insertQuery(OtpModel, {
            phoneNumber: data.phoneNumber,
            email: data.email,
            otp: otp
        })
        if (insertOtp.errors) {
            return insertOtp.errors
        } else {
            return insertOtp
        }
    }
    if (getdata.length > 0) {
        return 1
    }
}

module.exports = {
    getnerateOTP
}