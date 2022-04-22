const HttpStatus = require("http-status")

//custome errors

const INTERNAL_SERVER_ERROR = new Error("INTERNAL_SERVER_ERROR")
INTERNAL_SERVER_ERROR.status = HttpStatus.INTERNAL_SERVER_ERROR + "INTERNAL_SERVER_ERROR"

const DATA_NOT_FOUND = new Error("DATA_NOT_FOUND")
DATA_NOT_FOUND.status = HttpStatus.NOT_FOUND + " DATA_NOT_FOUND"

const UNAUTHORIZED = new Error("UNAUTHORIZED")
UNAUTHORIZED.status = HttpStatus.UNAUTHORIZED + " UNAUTHORIZED"

const CONFLICT = new Error("CONFLICT")
CONFLICT.status = HttpStatus.CONFLICT + " CONFLICT"

const BAD_REQUEST = new Error("BAD_REQUEST")
BAD_REQUEST.status = HttpStatus.BAD_REQUEST + " BAD_REQUEST"
module.exports = {
    INTERNAL_SERVER_ERROR,
    DATA_NOT_FOUND,
    UNAUTHORIZED,
    CONFLICT,
    BAD_REQUEST
}