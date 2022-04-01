const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const categorySchema = mongoose.Schema({
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


const CategoryModel = mongoose.model("category", categorySchema)

module.exports = {
    CategoryModel
}