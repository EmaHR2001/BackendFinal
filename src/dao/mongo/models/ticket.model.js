const {model, mongoose} = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2")

const Schema = mongoose.Schema

const collection = "tickets"

const ticketSchema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  purchase_datetime: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  products: {
    type: Array,
    required: true
  },
  purchaser: { 
    type: String, 
    required: true 
  },
});
ticketSchema.plugin(mongoosePaginate)
const TicketModel = model(collection, ticketSchema)

module.exports = {
    TicketModel
}
