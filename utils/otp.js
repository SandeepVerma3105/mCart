const helperService = require("../services/helper")
const crypto = require('crypto');
const { OtpModel } = require("../models/otp")
const getOtp = async(key) => {
    // key = await crypto.randomBytes(5).readUInt16BE(0, true)
    key = await Math.floor(Math.random() * 90000) + 10000;
    // if (key < 10000) {
    //     key = await crypto.randomBytes(5).readUInt16BE(0, true)
    // }
    return key
}
const getnerateOTP = async(data) => {
    let otp = await getOtp()
    getdata = await helperService.findQuery(OtpModel, data)
    console.log("hjhdj", getdata)
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