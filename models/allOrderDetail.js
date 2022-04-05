const mongoose = require("mongoose")
const { Schema } = require("../config/connection")


const orderSchema = mongoose.Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "orderDetail"
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    name: {
        type: String,
    },
    productId: {
        type: String
    },
    productName: {
        type: String
    },
    baseCost: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
    },
    unit: {
        type: Number,
        required: true
    },
    address: {
        houseNo: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String
        },
        city: {
            type: String
        }
    },
    orderStatus: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 1
    },
    transectionStatus: {
        type: Boolean,
        default: false
    },
    transectionId: {
        type: String
    },
}, { timestamps: true })

const AllOrderDetailModel = mongoose.model('allOrderDetail', orderSchema)
module.exports = {
    AllOrderDetailModel
}