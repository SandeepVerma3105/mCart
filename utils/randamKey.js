var crypto = require('crypto');

//create a random number
const random_key = async function randU32Sync(key) {
    key = await crypto.randomBytes(4).readUInt32BE(0, true);
    return key
}

const otp = async(key) => {
    key = await crypto.randomBytes(4).readUInt16BE(0, true)
    return key
}

module.exports = {
    random_key,
    otp
}