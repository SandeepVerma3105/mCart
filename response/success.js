const successResponse = async(status, response = "null", code, error = "null", message, data) => {
    if (error == "") {
        error = null
    }
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