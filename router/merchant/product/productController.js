const httpStatus = require("http-status")
const { ObjectID } = require("bson")
const { ProductModel } = require("../../../models/product")
const { MerchantModel } = require("../../../models/merchant")
const { MerchantAddressModel } = require("../../../models/merchantAddress")
const { CategoryModel } = require("../../../models/category")
const { BrandModel } = require("../../../models/brand")

const constents = require("../../../constents/constent")
const errors = require("../../../error/error")
const helperService = require("../../../services/helper")
const { successResponse } = require("../../../response/success")

const category = async(req, res) => {
    getdata = await helperService.findQuery(CategoryModel, req.body)
    console.log(getdata)
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
            constents.CATEGORY_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}


const brands = async(req, res) => {
    getdata = await helperService.findQuery(BrandModel, req.body)
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
            constents.CATEGORY_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}


const addProduct = async(req, res, next) => {
    data = req.item
    let getmerchant = await helperService.findQuery(MerchantModel, { _id: data.merchantId })
    if (getmerchant.length > 0) {
        if (data.discount) {
            disCost = data.baseCost - (data.baseCost * (data.discount / 100))
        } else {
            disCost = 0
        }
        let getdata = await helperService.insertQuery(ProductModel, {
            merchantId: data.merchantId,
            categoryId: data.categoryId,
            brandName: data.brandName,
            name: data.name,
            sortDescription: data.sortDescription,
            longDescription: data.longDescription,
            unit: data.unit,
            baseCost: data.baseCost,
            discountCost: disCost,
            discount: data.discount,
            size: data.size,
            gender: data.gender,
            ageGroup: data.ageGroup,
        })
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
                true,
                getdata,
                httpStatus.OK,
                "",
                constents.ADD_PEODUCT
            )
            res.status(httpStatus.OK).json(result)
        }
    } else {
        result = await successResponse(
            true,
            null,
            httpStatus.OK, {
                errCode: errors.DATA_NOT_FOUND.status,
                errMsg: constents.MERCHENT_NOT_EXIST
            },
            ""
        )
        res.status(httpStatus.NOT_FOUND).json(result)
    }
}

const getProduct = async(req, res) => {
    let field = ''
    data = req.query
    if (!req.query) {
        req.query = req.query
    }
    if (req.query.productId) {
        req.query._id = req.query.productId
        field = [
            { path: "merchantId", model: "merchant", select: ["_id", "firstName", "lastName", "email"] },
            { path: "categoryId", model: "category", select: ["_id", "name", "lastName"] }
        ]
    }
    if (req.query.merchantId) {
        req.query.merchantId = req.query.merchantId
    }
    if (req.body.globalSearchString) {
        req.query.$text = { $search: req.query.globalSearchString }
    }
    if (req.body.searchString) {
        req.query.name = { $regex: '.*' + req.query.searchString + '.*' }

    }
    getdata = await helperService.populateQuery(ProductModel, req.query, field)
    console.log(getdata)
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
            constents.PRODUCT_LIST
        )
        res.status(httpStatus.OK).json(result)
    }
}

const updateProduct = async(req, res, next) => {
    data = req.body
    data.updatedAt = new Date()
    qury = { _id: req.query.productId, merchantId: req.query.merchantId }
    getdata = await helperService.updateQuery(ProductModel, qury, data)
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
        if (data.isDelete) {
            msg = constents.DELETE_PRODUCT,
                response = getdata
        } else {
            msg = constents.UPDATE_PRODUCT,
                response = getdata
        }
        result = await successResponse(
            true,
            response,
            httpStatus.OK,
            "",
            msg
        )
        res.status(httpStatus.OK).json(result)

    }
}

module.exports = {
    addProduct,
    getProduct,
    updateProduct,
    category,
    brands
}