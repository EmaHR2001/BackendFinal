const { envConfig } = require("../config/config");
const { Stripe } = require("stripe");

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY);

class StripePayment {
    async purchase(products) {
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

            // Crear una sesión de pago en Stripe
            const sessionStripe = await stripe.checkout.sessions.create({
                payment_method_types: ['card'], // Puedes agregar otros métodos de pago si es necesario
                line_items: lineItems,
                mode: 'payment',
                success_url: 'URL_de_retorno_exitoso', // Reemplaza con tu URL real
                cancel_url: 'URL_de_cancelación', // Reemplaza con tu URL real
            });

            return sessionStripe;
        } catch (error) {
            throw new Error('Problema al realizar el pago en Stripe');
        }
    }
}

module.exports = StripePayment;