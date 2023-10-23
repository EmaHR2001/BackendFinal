class TicketRepository {
    constructor(dao){
        this.dao = dao
    }
    getTickets(){
        return this.dao.get()
    }
    getTicket(tid){
        return this.dao.getById(tid)
    }
    createTicket(newTicket){
        return this.dao.create(newTicket)
    }
    updateTicket(tid){
        return this.dao.update(tid)
    }
    deleteTicket(tid){
        return this.dao.delete(tid)
    }
}

module.exports = TicketRepository