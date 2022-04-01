const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
})

const AdminModel = mongoose.model("admin", adminSchema)

module.exports = {
    AdminModel
}