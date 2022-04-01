const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const cartSchema = mongoose.Schema({
        unit: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "product"
        }
    }

    , { timestamps: true }
)


const CartModel = mongoose.model("cart", cartSchema)

module.exports = {
    CartModel
}