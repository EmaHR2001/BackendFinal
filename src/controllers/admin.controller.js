const { TicketModel } = require("../dao/mongo/models/ticket.model");
const { UserModel } = require("../dao/mongo/models/user.model");
const { userService } = require("../services");

class AdminController {
    adminUsers = async (req, res) => {
        try {
            const {page = 1} = req.query
            const products = await UserModel.paginate(
                {},
                {limit: 3, page: page, lean: true}
            );
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products
            const {username} = req.user
            if(!req.user){
                req.logger.error("No se encontró el usuario")
                res.status(400).send({
                    status: "error",
                    message: "Error al encontrar el usuario"
                })
                return
            }
            res.status(200).render("adminUsers", {
                status: "success",
                email: username,
                users: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            })
        } catch (error) {
            req.logger.error("Error al acceder al endpoint", error)
        }
    }
    adminTickets = async (req, res) => {
        try {
            const {page = 1} = req.query
            const tickets = await TicketModel.paginate(
                {},
                {limit: 3, page: page, lean: true}
            );
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = tickets
            if(!tickets){
                req.logger.error("No se encontraron tickets")
                res.status(400).send({
                    status: "Error",
                    message: "Error no se encontraron tickets"
                })
                return
            }
            const {username} = req.user
            if(!req.user){
                req.logger.error("No se encontró el usuario")
                res.status(400).send({
                    status: "error",
                    message: "Error al encontrar el usuario"
                })
                return
            }
            res.status(200).render("adminTickets", {
                status: "success",
                email: username,
                tickets: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            })
        } catch (error) {
            req.logger.error("Error al acceder al endpoint", error)
        }
    }
    changeRole = async (req, res) =>{
        try {

            const {uid} = req.params
            const { role } = req.body

            const user = await userService.getUser(uid)

            if(!user){
                req.logger.error("No se encontro el usuario")
                res.status(404).send({
                    status: "error",
                    message: "Error al encontrar el usuario"
                });
                return
            }

            const userRole = user[0].role

            const userUpdate = await userService.updateRole(uid, role);

            if(userUpdate === userRole){
                req.logger.info("No se actualizó el rol del usuario")
                res.status(200).send({
                    status: "Error",
                    message: "El usuario ya cuenta con el rol seleccionado"
                })
                return
            }

            req.logger.info("Rol actualizado correctamente")
            res.status(200).redirect("/api/users/admin")

        } catch (error) {
            req.logger.error("Error al cambiar de rol", error)
        }
        
    }
    deleteUser = async (req, res) => {
        try {
            const {uid} = req.params
            const user = userService.getUser(uid)
            if(!user){
                req.logger.error("No se encontro el usuario")
                res.status(404).send({
                    status: "error",
                    message: "Error al encontrar el usuario"
                });
                return
            }
            await userService.deleteUser(uid);
            req.logger.info("Usuario eliminado correctamente")
            res.status(200).redirect("/api/users/admin")
        } catch (error) {
          req.logger.error("error al eliminar el usuario", error)
        }
    }
}

module.exports = new AdminController()

