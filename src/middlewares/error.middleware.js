const { EError } = require("../utils/CustomError/EErrors");

exports.errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case EError.INVALID_TYPE_ERROR:
            return res.send({status: "error", error: error.name})
            break;
        
        case EError.PRODUCT_NOT_FOUND:
            return res.send({status: "error", error: error.name})
            break;

        case EError.INVALID_PRICE:
            return res.send({status: "error", error: error.name})
            break;

        case EError.MISSING_FIELD:
            return res.send({status: "error", error: error.name})
            break;
    
        case EError.DATABASE_ERROR:
            return res.send({status: "error", error: error.name})
            break;

        default:
            return res.send({status: "error", error: "Unhandled error"})
            break;
    }
}