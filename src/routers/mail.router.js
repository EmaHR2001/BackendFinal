const {Router} = require("express")
const { sendSms, sendWhatsapp } = require("../utils/sendSms")
const { sendMail } = require("../utils/sendmail")

const routerMail = Router()

routerMail
    .get('/mail', async (req, res) => {
        let destino = 'projectodigitalgen@gmail.com'
        let subject = 'Correo de prueba comsión 39750'
        let html = `<div>
            <h1>Esto es un test</h1>
        </div>`
        
        let result = await sendMail(destino, subject, html)
        res.send('Email enviado', result)
    })

    .get("/sms", async (req, res) => {
    let result = await sendSms("Joaquin", "Rodriguez")
    res.send({status: "success", result: "Message sent"})
    })
    .get("/wpp", async (req, res) => {
        await sendWhatsapp("Joaquín", "Rodriguez")
        res.send("wpp enviado")
    })
    
module.exports = routerMail