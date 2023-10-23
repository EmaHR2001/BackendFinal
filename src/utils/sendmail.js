const { createTransport } = require('nodemailer')
const { envConfig } = require("../config/config")

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: envConfig.GMAIL_EMAIL_APP,
        pass: envConfig.GMAIL_PASS_APP
    }
})

let from = `Servicio de email <${envConfig.GMAIL_EMAIL_APP}>`

exports.sendEmail = async (email, subject, html) => {
    return await transport.sendMail({
        from,
        to: email,
        subject,
        html
    })
}

exports.sendEmailCreateProduct = async (username, newProduct, owner) =>{
    const newProductHTML = `
        <div class="justify-content-center m-3">
            <h1>Hola ${username}! Has creado un producto correctamente</h1>
        </div>
        <h1>Nombre del producto: ${newProduct}</h1><br>
        <h3>Create by: ${owner}</h3>
    `
    try {
        const mail = await transport.sendMail({
        from,
        to: username,
        subject: 'Producto creado correctamente',
        html: newProductHTML,
        })
        return mail;
    } catch (error) {
        throw error;
    }
}

exports.sendEmailResetPassword = async (email, token) => {
    return await transport.sendMail({
        from,
        to: email,
        subjet: "Recuperación de contraseña",
        html: `
        <h2>Hola,</h2>
        <h4>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</h4>
        <a href="http://localhost:8080/api/session/reset-password/${token}">Restablecer contraseña</a>
        <p>Si no solicitaste restablecer tu contraseña, ignora este correo.</p>
      `,
    })
}

exports.sendEmailExpirateAccount = async (email, subject, name, date) => {
    return await transport.sendMail({
        from,
        to: email,
        subject,
        html: `
        <h2>Hola ${name}.</h2>
        <h4>Su ultima conección a la plataforma fue "${date}"</h4><br>
        <p>pese a su inactividad en la plataforma hemos decidido eliminar su cuenta.</p>
      `,
    })
}

exports.sendEmailDeleteProduct = async (email, subject, name, productName, userName) => {
    return await transport.sendMail({
        from,
        to: email,
        subject,
        html: `
        <h2>Estimado ${name}.</h2>
        <h4>Su producto: "${productName}" fue eliminado de la plataforma por el siguiente usuario o administrador: ${userName}.</h4>
      `,
    })
}

exports.sendEmailTicket = async (email, ticket, productsDisponibles) => {
    const productsHTML = productsDisponibles.map((product) => {
        return `
        <div class="justify-content-center m-3">
            <h4 class="m-2">Producto: ${product.product.title}</h4>
            <p class="m-2">Cantidad: ${product.quantity}</p>
            <p class="m-2">Precio Unitario: $${product.product.price}</p>
            <p class="m-2">Subtotal: $${product.quantity * product.product.price}</p>
        </div>
        `;
    });
    const emailContent = `
        <div class="justify-content-center m-3">
            <h1>¡GRACIAS POR TU COMPRA!</h1>
        </div>
        <div class="justify-content-center m-3">
            <h2>Número de ticket: ${ticket}</h2>
        </div>
        <div class="justify-content-center m-3">
            <h3 mb-3>Detalles de la compra:</h3>
            ${productsHTML} 
        </div>
    `;
    try {
        const info = await transport.sendMail({
        from,
        to: email,
        subject: 'Gracias por tu compra!',
        html: emailContent,
        })
        return info;
    } catch (error) {
        throw error;
    }
};

exports.sendEmailOwner = async (productOwnerEmail, productOwnerName, productName, purchaserName) => {
    const emailContent = `
        <div class="justify-content-center m-3">
            <h1>¡Venta realizada!</h1>
        </div>
        <div class="justify-content-center m-3">
            <h3>Hola, ${productOwnerName}</h3>
            <p>Tu producto "${productName}" ha sido comprado por ${purchaserName}.</p>
            <p>¡Felicidades por tu venta!</p>
        </div>
    `;
    try {
        const info = await transport.sendMail({
            from,
            to: productOwnerEmail,
            subject: `¡Venta de ${productName}`,
            html: emailContent,
        });
        return info;
    } catch (error) {
        console.error('Error al enviar el correo electrónico a los creadores del producto: ', error);
        throw error;
    }
};
