const httpStatus = require("http-status")
const { ObjectID } = require("bson")

const { ProductModel } = require("../../../models/product")
const { MerchantModel } = require("../../../models/merchant")
const { MerchantAddressModel } = require("../../../models/merchantAddress")
const { UserModel } = require("../../../models/user")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const helperService = require("../../../services/helper")
const { successResponse } = require("../../../response/success")

const customers = async(req, res) => {
    getdata = await helperService.findQuery(UserModel, req.body)
    if (getdata.error) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.INTERNAL_SERVER_ERROR.status,
                errMsg: constents.INTERNAL_SERVER_ERROR
            },
            ""
        )
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    } else {
        result = await successResponse(
            true, { data: getdata, count: getdata.count },
            httpStatus.OK,
            "",
            constents.customer_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const customerDetail = async(req, res) => {
    req.body._id = req.query.userId
    console.log("ndkjdk=", req.body)
    getdata = await helperService.populateQuery(UserModel, req.body, [{ path: "address", select: ["-__v", "-createdAt", "-updatedAt"] }])
    if (getdata.errors) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.INTERNAL_SERVER_ERROR.status,
                errMsg: constents.INTERNAL_SERVER_ERROR
            },
            ""
        )
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    } else {
        result = await successResponse(
            true, { data: getdata, count: getdata.count },
            httpStatus.OK,
            "",
            constents.customer_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}


const blockCustomer = async(req, res) => {
    data = req.item
    console.log(data)
    getdata = await helperService.updateByIdQuery(UserModel, data.customerId, { customerStatus: data.status })
    if (getdata.reason) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.INTERNAL_SERVER_ERROR.status,
                errMsg: constents.INTERNAL_SERVER_ERROR
            },
            ""
        )
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
    }
    if (getdata == 0) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.DATA_NOT_FOUND.status,
                errMsg: constents.DATA_NOT_FOUND
            },
            ""
        )
        res.status(httpStatus.NOT_FOUND).json(result)
    } else {
        result = await successResponse(
            true, {
                customer: getdata
            },
            httpStatus.OK,
            "",
            constents.CHANGE_customer_STATUS
        )
        res.status(httpStatus.OK).json(result)
    }
}

// const customersDetail = async(req, res) => {
//     getdata = await helperService.populateQuery(UserModel, req.body, [])
//     if (getdata.error) {
//         result = await successResponse(
//             true,
//             null,
//             httpStatus.OK, {
//                 errCode: errors.INTERNAL_SERVER_ERROR.status,
//                 errMsg: constents.INTERNAL_SERVER_ERROR
//             },
//             ""
//         )
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json(result)
//     } else {
//         result = await successResponse(
//             true, { data: getdata, count: getdata.count },
//             httpStatus.OK,
//             "",
//             constents.customer_LIST
//         )
//         res.status(httpStatus.OK).json(result)
//     }
// }


module.exports = {
    customers,
    blockCustomer,
    customerDetail
}