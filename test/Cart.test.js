const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe("Testing de Carts", () => {
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
    it('El endpoint GET /api/cart debe devolver todos los carritos', async function () {
        const { statusCode, _body, ok } = await requester.get("/api/product").set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
        expect(_body).to.have.property('payload').that.is.an('array');
    });
    it('El endpoint GET /api/cart/:cid debe devolver un carrito por su id', async function () {
        const cid = "64d99e0f907f8a91b619ecdf"
        const { statusCode, _body, ok } = await requester.get(`/api/cart/${cid}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
        expect(_body).to.be.an('object');
    });
    it('El endpoint POST /api/cart/:uid debe crear un carrito para el usuario', async () => {
        const uid = "649a4ea5f978a70f8ed5dbd6"

        const { statusCode, ok } = await requester.post(`/api/cart/${uid}`).set("Cookie", [`${cookie.name}=${cookie.value}`]); // Agrega la autorización necesaria

        expect(statusCode).to.be.equal(200);;
        expect(ok).to.be.equal(true);
    })
    it('El endpoint PUT /api/cart/:cid/product/:pid debe agregar un producto al carrito', async function () {
        const pid = "6462bac96761df59fba0c7c4"
        const cid = "64d99e0f907f8a91b619ecdf"
        const { statusCode, ok } = await requester.put(`/api/cart/${cid}/product/${pid}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
    });
    it('El endpoint DELETE /api/cart/:cid/product/:pid debe eliminar un producto del carrito', async function () {
        const pid = "6462bac96761df59fba0c7c4"
        const cid = "64d99e0f907f8a91b619ecdf"
        const { statusCode, _body, ok } = await requester.delete(`/api/cart/${cid}/product/${pid}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
        expect(_body).to.be.an('object');;
    });
    it('El endpoint DELETE /api/cart/:cid debe eliminar un carrito', async function () {
        const cid = "64c9c4b606d703c41d81f764"
        const { statusCode, ok } = await requester.delete(`/api/cart/${cid}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
    });
    it('El endpoint POST /api/cart/:cid/pucharse debe crear un ticket', async function () {
        const cid = "64c9c4b606d703c41d81f764"
        const { statusCode, ok } = await requester.post(`/api/cart/${cid}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(statusCode).to.be.equal(200);
        expect(ok).to.be.equal(true)
    });
});