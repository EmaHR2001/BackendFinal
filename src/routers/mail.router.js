const {Router} = require("express")
const { sendSms, sendWhatsapp } = require("../utils/sendSms")
const { sendMail } = require("../utils/sendmail")

const routerMail = Router()

routerMail
    .get('/mail', async (req, res) => {
        let destino = 'prueba@gmail.com'
        let subject = 'Correo de prueba'
        let html = `<div>
            <h1>Esto es un test</h1>
        </div>`
        
        let result = await sendMail(destino, subject, html)
        res.send('Email enviado', result)
    })

    .get("/sms", async (req, res) => {
    let result = await sendSms("Nombre", "Apellido")
    res.send({status: "success", result: "Message sent"})
    })
    .get("/wpp", async (req, res) => {
        await sendWhatsapp("Nombre", "Apellido")
        res.send("wpp enviado")
    })
    
module.exports = routerMail