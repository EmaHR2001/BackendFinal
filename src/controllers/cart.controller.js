const { cartService, productService, ticketService, userService } = require("../services/index")
const uuid4 = require("uuid4")
const { addToCart } = require("../utils/CustomError/info")
const { EError } = require("../utils/CustomError/EErrors")
const { sendEmailTicket, sendEmailOwner } = require("../utils/sendmail")
const { Stripe } = require("stripe")
const { envConfig } = require("../config/config")

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY);

class CartController {
    userCart = async (req, res) => {
        try {
            //const { uid } = req.params
            const { cart, first_name, last_name } = req.user
            const cartUser = await cartService.getById(cart)
            if (!req.user) {
                req.logger.error("No se encontró el usuario")
                res.status(404).send({
                    status: "Error",
                    message: "No se encontró el usuario"
                });
                return
            }
            if (!cart) {
                req.logger.error("El usuario no tiene un carrito asignado.");
                res.status(404).send({
                    status: "Error",
                    message: "El usuario no tiene un carrito asignado."
                });
                return;
            };

            const productsCart = cartUser.products.map(item => ({
                product: item.product,
                quantity: item.quantity,
                total: item.quantity * item.product.price,
            }));

            const totalCompra = productsCart.reduce((total, product) => total + product.total, 0);

            res.status(200).render("userCart", {
                name: first_name + " " + last_name,
                products: productsCart,
                total: totalCompra,
                cartId: cart
            })
        } catch (error) {
            req.logger.error("Error al obtener el carrito", error)
        }
    }

    get = async (req, res) => {
        try {
            let carts = await cartService.getCarts()
            res.status(200).send(carts)
        } catch (error) {
            req.logger.http('Error al ver los carritos', error);
            req.logger.error('Error al ver los carritos', error);
        }
    }

    getCartById = async (req, res) => {
        const { cid } = req.params
        try {
            const cart = await cartService.getById(cid)

            if (!cart) {
                res.status(400).send({
                    status: 'error',
                    mensaje: "Carrito no encontrado"
                });
                return
            }
            req.logger.info("Carrito encontrado correctamente: ", cart)
            res.status(200).send({
                status: 'Success',
                payload: cart
            })

        } catch (error) {
            req.logger.error('Error al encontrar el carrito', error);
        }
    }

    create = async (req, res) => {
        try {
            const { uid } = req.params
            const user = userService.getUser(uid)
            if (!user) {
                req.logger.error("No se encontró el usuario")
                res.status(404).send({
                    status: "Error",
                    message: "No se encontro el usuario para generar un carrito de compra"
                });
                return
            }
            let cart = await cartService.createCart(uid)
            if (!cart) {
                req.logger.error("No se creó el carrito")
                res.status(400).send({
                    status: 'error',
                    mensaje: "Error al crear el carrito"
                });
                return
            }

            req.logger.info("Se creo el carrito")
            res.status(200).send({ status: 'success', payload: cart })
        } catch (error) {
            req.logger.http('Error al crear carrito', error);
            req.logger.error('Error al crear carrito', error);
        }
    }

    addProduct = async (req, res, next) => {
        const { cid, pid } = req.params
        // valid product id
        const product = await productService.getProduct(pid)
        const user = req.user;
        if (!user) {
            req.logger.error("No se encontró el usuario")
            res.status(400).send({
                status: "Error",
                message: "Necesita loguearse para realizar esta acción"
            });
            return
        };
        if (!product) {
            req.logger.error("el producto no existe")
            res.status(404).send({
                status: "Error",
                message: "El producto no existe o no tiene stock"
            });
            return
        };
        if (user.role === 'premium' && product.owner.username === user.username) {
            req.logger.info("No puedes agregar tu propio producto al carrito")
            res.status(400).send({
                status: "Error",
                message: "No puedes agregar tu propio producto al carrito"
            });
            return
        };
        const quantity = req.body.quantity | 1
        try {
            const response = await cartService.addProduct(cid, pid, quantity)
            if (response.status === "error") {
                CustomError.createError({
                    name: "Error add to cart",
                    cause: addToCart({
                        title: product.title
                    }),
                    message: "Error add product to cart",
                    code: EError.ADD_PRODUCT_CART
                })
            }

            res.status(200).send(response)

        } catch (error) {
            req.logger.info('Error al añadir el producto', error);
            req.logger.error('Error al añadir el producto', error);
            next(error)
        }
    }

    addProductArray = async (req, res) => {
        const { cid } = req.params
        const { products } = req.body

        let allProductsOk = true

        for (const item of products) {
            const exist = await productValid(item.product)
            if (!exist) {
                allProductsOk = false
                break
            }
        }
        if (!allProductsOk) {
            res.status(400).send({
                status: 'error',
                message: 'El producto indicado no existe'
            });
            return
        }

        try {
            const response = await cartService.modifyProducts(cid, products)
            if (response.status === "error") {
                return res.status(400).send(response)
            } else {
                return res.status(200).send(response)
            }
        } catch (error) {
            req.logger.error(error)
        }
    }
    async productValid(pid) {
        exist = await productService.getProduct(pid)
        return !!exist
    }

    deleteProduct = async (req, res) => {
        const { cid, pid } = req.params
        try {
            const response = await cartService.deleteProduct(cid, pid)
            if (response.status === "error") {
                return res.status(400).send(response)
            } else {
                return res.status(200).send(response)
            }
        } catch (error) {
            req.logger.error('Error al borrar el producto del carrito', error);
        }
    }

    deleteAllProducts = async (req, res) => {
        const { cid } = req.params
        try {
            const response = await cartService.deleteAllProducts(cid)
            if (response.status === "error") {
                return res.status(400).send(response)
            } else {
                return res.status(200).send(response)
            }
        } catch (error) {
            req.logger.http('Error al borrar el carrito', error);
            req.logger.error('Error al borrar el carrito', error);
        }
    }

    cartPurchase = async (req, res) => {
        try {
            const { cid } = req.params;
            const user = req.user
            if (!user) {
                req.logger.error("Debes estar logueado para realizar esta acción")
                res.status(400).send({
                    status: "Error",
                    message: "Debes estar logueado para realizar esta acción"
                })
            }
            // Obtén el carrito y verifica que exista
            const cart = await cartService.getById(cid);
            if (!cart) {
                req.logger.error("Error al obtener el carrito")
                res.status(404).send({
                    status: "Error",
                    error: 'Carrito no encontrado'
                });
            };
            // Verifica el stock de los productos en el carrito
            const productsNoStock = [];

            for (const item of cart.products) {
                const product = item.product
                const price = item.product.price
                const quantity = item.quantity
                const stock = item.product.stock
                const pid = item.product._id
                // Verifica que el producto exista y tenga suficiente stock
                const existingProduct = await productService.getProduct(pid);
                if (!existingProduct) {
                    req.logger.error("Producto no encontrado")
                    res.status(404).send({
                        status: "Error",
                        message: `Un producto no se encuentra en nuestra base de datos, id: ${pid}`
                    });
                    return
                }
                if (quantity > existingProduct.stock) {
                    // Si el producto no tiene suficiente stock, no se agrega al proceso de compra
                    productsNoStock.push(pid)
                } else {
                    // Actualiza el stock del producto
                    const updatedStock = existingProduct.stock - quantity;
                    // Actualiza el stock de los productos en la base de datos
                    await productService.update(pid, { stock: updatedStock })
                }
            }

            const productsDisponibles = cart.products.filter((product) => !productsNoStock.includes(product.product._id));
            if (productsNoStock.length > 0) {
                await cartService.updateProductsCart(cid, productsNoStock)
                const ticketData = {
                    code: uuid4(), //uuidv4
                    purchaser: req.user.email,
                    products: productsDisponibles,
                    amount: productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0),
                }

                const newTicket = await ticketService.createTicket(ticketData)
                if (!newTicket) {
                    req.logger.error("No se generó el ticket de compra")
                    res.status(400).send({
                        status: "Error",
                        message: "Error al generar el ticket de compra"
                    });
                    return
                };

                for (const product of newTicket.products) {
                    const productName = product.product.title;
                    const productOwnerEmail = product.product.owner.email;
                    const productOwnerName = product.product.owner.username;

                    sendEmailOwner(productOwnerEmail, productOwnerName, productName, newTicket.purchaser);
                };
                sendEmailTicket(user.username, newTicket._id, productsDisponibles)

                req.logger.info('Proceso de compra finalizada con exito, los productos que están a falta de stock son: ', productsNoStock);

                try {
                    const stripeInfo = await this.stripePayment(productsDisponibles)
                    res.redirect(stripeInfo)
                } catch (error) {
                    console.log(error)
                }
            } else {
                const ticketData = {
                    code: uuid4(),
                    purchaser: req.user.email,
                    products: productsDisponibles,
                    amount: productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0),
                }
                req.logger.info('Proceso de compra finalizada con exito', ticketData);
                const newTicket = await ticketService.createTicket(ticketData)
                if (!newTicket) {
                    req.logger.error("No se generó el ticket de compra")
                    res.status(400).send({
                        status: "Error",
                        message: "Error al generar el ticket de compra"
                    });
                    return
                }
                for (const product of newTicket.products) {
                    const productName = product.product.title;
                    const productOwnerEmail = product.product.owner.email;
                    const productOwnerName = product.product.owner.username;
                    sendEmailOwner(productOwnerEmail, productOwnerName, productName, newTicket.purchaser);
                };
                sendEmailTicket(user.username, newTicket._id, productsDisponibles)
                await cartService.deleteAllProducts(cid);
                req.logger.info("Se generó el ticket correctamente")

                console.log("Productos disponibles:" + productsDisponibles)

                try {
                    const stripeInfo = await this.stripePayment(productsDisponibles)
                    res.redirect(stripeInfo)
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            req.logger.error('Error al finalizar la compra', error);
            res.status(500).send({
                error: 'Error al finalizar el proceso de compra'
            });
        }
    }

    async stripePayment(products) {
        console.log("lista:" + products)
        try {
            // Crear una lista de productos para la compra en Stripe
            const lineItems = products.map((product) => {
                return {
                    price_data: {
                        product_data: {
                            name: product.product.title,
                            description: product.product.description,
                        },
                        currency: 'usd',
                        unit_amount: product.product.price * 100, // El precio debe estar en centavos
                    },
                    quantity: product.quantity,
                };
            });
            console.log("lineItems:" + lineItems)

            // Crear una sesión de pago en Stripe
            const sessionStripe = await stripe.checkout.sessions.create({
                payment_method_types: ['card'], // Puedes agregar otros métodos de pago si es necesario
                line_items: lineItems,
                mode: 'payment',
                success_url: 'http://' + envConfig.HOST_URL + '/api/product/products', // Reemplaza con tu URL real
                cancel_url: 'http://' + envConfig.HOST_URL + '/api/product/products', // Reemplaza con tu URL real
            });
            return sessionStripe.url
        } catch (error) {
            console.error('Error al realizar el pago en Stripe:', error);
            throw new Error('Problema al realizar el pago en Stripe');
        }
    }
}

module.exports = new CartController()