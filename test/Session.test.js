const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe("Testing de session", ()=>{
    let cookie
    it('El servicio debe registrar un usuario correctamente en la plataforma', async () => {
        let userMock = {
            username: "JOATEST3",
            first_name: 'Joa Test3',
            last_name: 'Rod test3',
            email: 'joaTest3@gmail.com',
            age: 22,
            password: '12345678'
        };

        const response = await requester.post('/api/session/register').send(userMock);
        expect(response.body).to.be.ok;
    });
    it('El servicio debe loguear un usuario correctamente y devolver la cookie', async ()=>{
        let userMock = {
            email: 'joaTest3@gmail.com',
            password: '12345678'
        }

        const result = await requester.post('/api/session/login').send(userMock)
        const cookieResult = result.headers['set-cookie'][0]
        expect(cookieResult).to.be.ok
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }

        expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
        expect(cookie.value).to.be.ok
    })
    it("Test ruta current", async ()=>{
        const {_body} = await requester.get("/api/session/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(_body.payload.username).to.be.equal('joaTest3@gmail.com')
    })
    it('Test logout user', async () => {

        const response = await requester.get('/api/session/logout').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(response.status).to.equal(200);
        expect(response.text).to.include('user logout');

        const currentResponse = await requester.get('/api/session/current')

        expect(currentResponse.status).to.equal(401); 
        expect(currentResponse.headers['set-cookie']).to.be.undefined;
    }); 
    it("Test enviar email para restaurar la contraseña", async () => {
        let email = "joaTest3@gmail.com";
        const response = await requester.post("/api/session/reset-password").send({ email });
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal(`Se envio el correo de recuperacion a: ${email}`);
    });
})