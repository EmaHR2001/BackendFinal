const { TicketModel } = require("../mongo/models/ticket.model");

class TicketDaoMongo{
    constructor(){
        this.ticket = TicketModel
    }

    async get(){
        try{
            return await this.ticket.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getById(tid){
        try{
            return await this.ticket.findOne({_id: tid})
        } catch(error){
            return new Error(error)
        }
    }
    async create(newTicket){
        try {
            return await this.ticket.create(newTicket)
        } catch (error) {
            return new Error(error)
        }
    }
    async update(tid, ticketToRemplace){
        try {
            await this.ticket.updateOne({_id: tid}, ticketToRemplace)
        } catch (error) {
            return new Error(error)
        }
    }
    async delete(tid){
        try {
            return await this.ticket.deleteOne({_id: tid})
        } catch (error) {
            return new Error(error)
        }
    }
}
module.exports = TicketDaoMongo