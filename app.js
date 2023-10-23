const cluster = require("cluster")
const {cpus} = require("os")
const { initServer } = require("./src/server")

const numeroDeProcesadores = cpus().length

if(cluster.isPrimary){
    for(let i = 0 ; i < numeroDeProcesadores; i++){
        cluster.fork()
    }
    cluster.on("message", worker => {
        logger.info(`El worker ${worker.process.id} dice ${worker.message}`)
    })
} else {
}



initServer()