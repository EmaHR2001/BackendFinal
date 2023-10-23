const { envConfig } = require("../config/config");

let CartDao
let UserDao
let ProductDao
let TicketDao

switch (envConfig.PERSISTENCE) {
    case "production":
    
        const ProductDaoMongo = require("../dao/mongo/product.mongo")
        const UserDaoMongo = require("../dao/mongo/user.mongo")
        const CartDaoMongo = require("../dao/mongo/cart.mongo")
        const TicketDaoMongo = require("../dao/mongo/ticket.mongo")

        UserDao = UserDaoMongo
        ProductDao = ProductDaoMongo
        CartDao = CartDaoMongo
        TicketDao = TicketDaoMongo
    break;

    case "development":
        
        const ProductDaoFile = require("../dao/mongo/product.mongo")
        const UserDaoFile = require("../dao/mongo/user.mongo")
        const CartDaoFile = require("../dao/mongo/cart.mongo")
        const TicketDaoFile = require("../dao/mongo/ticket.mongo")

        UserDao = UserDaoFile
        ProductDao = ProductDaoFile
        CartDao = CartDaoFile
        TicketDao = TicketDaoFile
    break;

    default:
        break;
}

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    TicketDao
}