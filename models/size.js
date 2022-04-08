const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const sizeSchema = mongoose.Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    size: {
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


const SizeModel = mongoose.model("size", sizeSchema)

module.exports = {
    SizeModel
}