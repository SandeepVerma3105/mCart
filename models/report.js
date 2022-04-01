const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const reportSchema = mongoose.Schema({
        comment: {
            type: String,
            required: true
        },
        adminId: {
            type: Schema.Types.ObjectId
        },
        merchentId: {
            type: Schema.Types.ObjectId
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "product"
        }
    }

    , { timestamps: true }
)


const ReportModel = mongoose.model("report", reportSchema)

module.exports = {
    ReportModel
}