const req = require("express/lib/request")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()

//function to generate jwt token
const SECRET_KEY = 'secret_key'
const jwtToken = (email, role, id) => {
    const token = jwt.sign({
            user: email,
            role: role,
            id: id
        },
        process.env.SECRET_KEY || SECRET_KEY, {
            expiresIn: "6000s"
        })
    return token
}


module.exports = {
    jwtToken,
}