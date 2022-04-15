const httpStatus = require("http-status")
const { ObjectID } = require("bson")

const { ProductModel } = require("../../../models/product")
const { MerchantModel } = require("../../../models/merchant")
const { MerchantAddressModel } = require("../../../models/merchantAddress")
const { OrderDetailModel } = require("../../../models/orderDetail")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const helperService = require("../../../services/helper")
const { successResponse } = require("../../../response/success")

const orders = async(req, res) => {
    req.query.merchantId = req.tokenData.id
    regex = new RegExp(req.query.productName, 'i')
        // field = [{ path: "productId", model: "product", select: ["_id", "name"] },
        //         // {  path: "userId",  model: "user",select: ["firstName", "lastName",]},
        //     ]
        // if (req.query.productName) {
        //     regex = new RegExp(req.query.productName, 'i')
        //     field = [
        //         { path: "productId", model: "product", select: ["name"], match: { name: regex } },
        //     ]
        // }
    field = [
            { path: "userId", model: "user", select: ["_id", "firstName", "lastName", "email"] },
            { path: "productId", model: "product", select: ["name"], match: { name: regex } },
            { path: "userAddressId", model: "userAddress" },
            { path: "merchantId", model: "merchant", select: ["_id", "firstName", "lastName", "phoneNumber", "email"] }
        ]
        // if (req.query._id) {
        //     field = [
        //         { path: "userId", model: "user", select: ["_id", "firstName", "lastName", "email"] },
        //         { path: "productId", model: "product", select: ["name"], match: { name: regex } },
        //         { path: "userAddressId", model: "userAddress" },
        //         { path: "merchantId", model: "merchant", select: ["_id", "firstName", "lastName", "phoneNumber", "email"] }
        //     ]
        // }
    getdata = await helperService.populateQuery(OrderDetailModel, req.query, field)
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
    }
    if (getdata == 0) {
        result = await successResponse(
            true, { data: [], count: 0 },
            httpStatus.OK,
            "",
            constents.ORDER_LIST
        )
        res.status(httpStatus.OK).json(result)
    } else {
        arr = []
        getdata.forEach(element => {
            if (element.productId != null) {
                arr.push(element)
            }

        });
        result = await successResponse(
            true, { data: arr, count: arr.length },
            httpStatus.OK,
            "",
            constents.ORDER_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const changeOrederStatus = async(req, res) => {
    data = req.item
    msg = ""
    if (data.status == 1) {
        msg = constents.ORDER_PENDING
    }
    if (data.status == 2) {
        msg = constents.ORDER_ACCEPTED
    }
    if (data.status == 3) {
        msg = constents.ORDER_CANCEL
    }
    if (data.status == 4) {
        msg = constents.ORDER_IN_TRANSIT
    }
    if (data.status == 5) {
        msg = constents.ORDER_DELEVERED
    }
    if (data.status != 1 && data.status != 2 && data.status != 3 && data.status != 4 && data.status != 5) {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.BAD_REQUEST.status,
                errMsg: constents.INVALID_ORDER_STATUS
            },
            ""
        )
        res.status(httpStatus.BAD_REQUEST).json(result)
        return
    }
    getdata = await helperService.updateQuery(OrderDetailModel, { _id: data.orderId, merchantId: req.tokenData.id }, { orderStatus: data.status })
    console.log(getdata)
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
                order: getdata
            },
            httpStatus.OK,
            "",
            msg
        )
        res.status(httpStatus.OK).json(result)
    }
}


const acceptOrder = async(req, res) => {
    data = req.body
    checkUnit = await helperService.populateQuery(
        OrderDetailModel, { _id: data.orderId }, {
            path: "productId",
            model: "product",
            select: ["_id", "name", "lastName", "unit"]
        }
    )
    console.log(checkUnit)
    if (checkUnit == 0) {
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
    }
    if (checkUnit.length > 0 && checkUnit[0].productId.unit >= checkUnit[0].unit) {
        getdata = await helperService.updateByIdQuery(
            OrderDetailModel,
            data.orderId, { orderStatus: 2 }
        )
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
                    order: getdata
                },
                httpStatus.OK,
                "",
                constents.CHANGE_ORDER_STATUS
            )
            res.status(httpStatus.OK).json(result)
        }
    }
    if (checkUnit.length > 0 && checkUnit[0].productId.unit <= checkUnit[0].unit) {
        result = await successResponse(
            true, {
                productQuantity: checkUnit[0].productId.unit,
                orderQuantity: checkUnit[0].unit
            },
            httpStatus.OK, {
                errCode: errors.BAD_REQUEST.status,
                errMsg: constents.QUANTITY
            },
            ""
        )
        res.status(httpStatus.BAD_REQUEST).json(result)
    }
}

const ordersDetail = async(req, res) => {


    field = [
        { path: "productId", model: "product", select: ["name"] },
    ]

    if (req.query._id) {
        field = [
            { path: "userId", model: "user", select: ["_id", "firstName", "lastName", "email"] },
            { path: "productId", model: "product", select: ["name"] },
            { path: "userAddressId", model: "userAddress" },
        ]
    }

    getdata = await helperService.populateQuery(OrderDetailModel, req.query, field)
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
    }
    if (getdata == 0) {
        result = await successResponse(
            true, { data: [], count: 0 },
            httpStatus.OK,
            "",
            constents.ORDER_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
    if (getdata.length > 0) {
        result = await successResponse(
            true, { data: getdata, count: getdata.count },
            httpStatus.OK,
            "",
            constents.ORDER_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}


module.exports = {
    orders,
    changeOrederStatus,
    acceptOrder,
    ordersDetail
}