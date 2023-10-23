const mongoose = require("mongoose")
const chai =  require("chai")
const { createHash, passwordValidation } = require("../src/utils")

mongoose.connect("mongodb://localhost")
const expect = chai.expect

describe("Testing de Bcypt", ()=>{
    it("El servicio debe devolver un hasheo efectivo del password", async ()=>{
        const password = "pass123456"
        const hashedPass = await createHash(password)
        expect(hashedPass).to.not.equal(password)
    })
    it("El servicio debe comparar de manera efectiva el password con el hash", async ()=>{
        const password = "pass123456"
        const hashedPass = await createHash(password)
        const userDbMock = {password: hashedPass}
        const isValidPass = await passwordValidation ({ password: hashedPass })
        expect(isValidPass).to.be.true
    })
})
describe("Testing Dto", ()=>{
    it("El servicio debe devolver un hasheo efectivo del password", async ()=>{
        let userMock = {
            first_name: "Joaquin",
            last_name: "Rodriguez",
            email: "j123@gmail.com",
            password: "123123"
        }
        const userDtoResult = UserDTO.getUserTokenFrom(userMock)
        expect(userDtoResult).to.have.property("name", `${userMock.first_name} ${userMock.last_name}`)
        expect(userDtoResult).to.not.have.property("first_name")
        expect(userDtoResult).to.not.have.property("last_name")
    })
})