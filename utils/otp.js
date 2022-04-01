const helperService = require("../services/helper")
const crypto = require('crypto');
const { OtpModel } = require("../models/otp")
const getOtp = async(key) => {
    key = await crypto.randomBytes(4).readUInt16BE(0, true)
    return key
}
const getnerateOTP = async(data) => {
    let otp = await getOtp()
    getdata = await helperService.findQuery(OtpModel, { phoneNumber: data.phoneNumber })
    if (getdata == 0) {
        insertOtp = await helperService.insertQuery(OtpModel, {
            phoneNumber: data.phoneNumber,
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