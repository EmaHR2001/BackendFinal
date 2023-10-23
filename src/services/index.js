//Arquitectura por capas -> Conecto la persistencia de factory con el Repository creando el servicio

//factory
const { UserDao, ProductDao, CartDao, TicketDao } = require("../dao/factory");
//Repository
const ProductRepository = require("../repositories/product.repository");
const UserRepository = require("../repositories/user.repository");
const CartRepository = require("../repositories/cart.repository");
const TicketRepository = require("../repositories/ticket.repository");

//Persistencias control
const userService = new UserRepository(new UserDao())
const productService = new ProductRepository(new ProductDao())
const cartService = new CartRepository(new CartDao())
const ticketService = new TicketRepository(new TicketDao())


module.exports = {userService, productService, cartService, ticketService}

