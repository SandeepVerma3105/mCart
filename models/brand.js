const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isDelete: {
        type: Boolean,
        dafault: false
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
    }
}, { timestamps: true })


const BrandModel = mongoose.model("brand", brandSchema)

module.exports = {
    BrandModel
}