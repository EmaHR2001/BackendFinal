const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe("Testing de products", ()=>{
    let cookie;
    before(async () => {
        // Realiza una solicitud de inicio de sesión para obtener la cookie
        const loginResponse = await requester.post('/api/session/login')
            .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' });

        // Obtiene la cookie de la respuesta
        const cookieResult = loginResponse.headers['set-cookie'][0];

        expect(cookieResult).to.be.ok

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }

        expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
        expect(cookie.value).to.be.ok
    });
    it('El endpoint GET /api/product debe devolver todos los productos', async function () {
        const {statusCode, _body, ok} = await requester.get("/api/product").set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
        expect(_body).to.have.property('payload').that.is.an('array');
    });
    it('El endpoint GET /api/product/:pid debe devolver un producto por su id', async function () {
        const prodID = "64cff4fb1ded62791868e5aa"
        const {statusCode, _body, ok} = await requester.get(`/api/product/${prodID}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
        expect(_body).to.be.an('object');
    });
    it('El endpoint POST /api/product/ debe crear un producto', async () => {
        const newProd = {
            title: "Libro 1",
            autor: "Brandon",
            description: "Description Libro 1",
            thumbnail: "",
            price: 50,
            stock: 14,
            category: "fantasy",
            code: "I$11"
        }
        const {statusCode, _body, ok} = await requester.post('/api/product').send(newProd).set("Cookie", [`${cookie.name}=${cookie.value}`]); // Agrega la autorización necesaria

        expect(statusCode).to.be.equal(200);;
        expect(ok).to.be.equal(true);
        expect(_body).to.be.an('object');
    })
    it('El endpoint PUT /api/product/:pid debe actualizar un producto', async function () {
        const pid = "64d6dc1dcdb4656e49df3271"
        const updateProd = {
            title: "Libro 1",
            autor: "Brandon",
            description: "1 descripción",
            thumbnail: "Http://rutadeimg.com",
            price: 50,
            stock: 14,
            category: "fantasy",
            code: "I$22134"
        }
        const {statusCode, _body, ok} = await requester.put(`/api/product/${pid}`).send(updateProd).set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
        expect(_body).to.be.an('object');;
    });
});