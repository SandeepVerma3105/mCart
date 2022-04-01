const successResponse = async(status, response = "null", code, error, message, data) => {
    data = {
        "status": status,
        "response": response,
        "code": code,
        "error": error,
        "msg": message
    }
    return await data
}

module.exports = {
    successResponse
}