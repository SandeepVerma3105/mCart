const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const brandSchema = mongoose.Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true
    },
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
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })


const BrandModel = mongoose.model("brand", brandSchema)

module.exports = {
    BrandModel
}