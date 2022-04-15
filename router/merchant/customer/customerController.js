const httpStatus = require("http-status")
const { ObjectID } = require("bson")

const { ProductModel } = require("../../../models/product")
const { MerchantModel } = require("../../../models/merchant")
const { MerchantAddressModel } = require("../../../models/merchantAddress")
const { UserModel } = require("../../../models/user")
const { MerchantBlockedCustomerModel } = require("../../../models/merchantBlockedCustomer")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const helperService = require("../../../services/helper")
const MerchantBlockedCustomerService = require("../../../services/customerMerchantMapping")
const { successResponse } = require("../../../response/success")
const { CustomerMerchantMapping } = require("../../../models/customerMerchantMapping")


const customers = async(req, res) => {
    data = {}
    data.merchant = req.tokenData.id
        // if (req.query.id) {
        //     data._id = req.query.id
        // }
        // if (req.query.name) {
        //     $or = [{ "customer._id.firstName": { $regex: '.*' + req.query.name + '.*', "$options": 'i' } },
        //         { "customer._id.lastName": { $regex: '.*' + req.query.name + '.*', "$options": 'i' } }
        //     ]
        // }
        // console.log(data)


    regex = new RegExp(req.query.name, 'i')
    field = [{ path: "customer._id", model: "user", select: ["-__v"] }]
    if (req.query.name) {

        field = [{ path: "customer._id", model: "user", select: ["-__v"], match: { $or: [{ firstName: regex }, { lastName: regex }] } }]
    }
    getdata = await helperService.populateQuery(CustomerMerchantMapping, data, field)

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
        console.log(getdata[0].customer)
        arr = []
        getdata[0].customer.forEach(element => {
            if (element._id != null) {
                arr.push(element)
            }

        });
        result = await successResponse(
            true, { data: arr, count: arr.length },
            httpStatus.OK,
            "",
            constents.customer_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}
const blockedCustomerList = async(req, res) => {


    field = [{ path: "customer._id", model: "user", select: ["-__v"] }]
    getdata = await helperService.populateQuery(MerchantBlockedCustomerModel, { merchant: req.tokenData.id }, field)
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
    req.query.merchantId = req.tokenData.id

    if (req.query.userId) {
        req.query._id = req.query.userId
    }

    if (req.query.name) {
        req.query.$or = [{ firstName: { $regex: '.*' + req.query.name + '.*', "$options": 'i' } },
            { lastName: { $regex: '.*' + req.query.name + '.*', "$options": 'i' } }
        ]
    }



    getdata = await helperService.populateQuery(UserModel, req.query, [{ path: "address", select: ["-__v"] }])
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

    console.log("status", data.status)
    if (data.status == true) {
        opt = `$push`
    }
    if (data.status == false) {
        opt = `$pull`
    }

    getdata = await MerchantBlockedCustomerService.updateQuery(MerchantBlockedCustomerModel, { merchant: req.tokenData.id }, {
        [opt]: { customer: { _id: data.customerId } }
    })
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
    customerDetail,
    blockedCustomerList
}