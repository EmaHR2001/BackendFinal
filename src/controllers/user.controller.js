const { UserDto } = require("../dto/user.dto")
const { userService } = require("../services")
const { sendEmailExpirateAccount } = require("../utils/sendmail")
class UserController {
    getUsers = async (req, res) => {
        try {
            let usersDTO = []
            let users = await userService.getUsers()
            if(!users){
                req.logger.error("Error al obtener usuarios")
                res.status(404).send({
                    status: "error",
                    message: "No se ha podido obtener los usuarios"
                });
                return
            }
            for (const user of users) {
                let userFilter = new UserDto(user)
                usersDTO.push(userFilter)
            };

            req.logger.info("Usuarios obtenidos correctamente")
            return res.status(200).send({
                success: "success", 
                payload: usersDTO
            })
        } catch (error) {
            req.logger.error("Error al obtener los usuarios usuarios", error)
        }
    }
    getUser = async (req, res) => {
        try{
            let { uid } = req.params
            let user = await userService.getUser(uid)
            if(!user){
                req.logger.error("Error al obtener el usuario", user)
                res.status(404).send({
                    status: "error",
                    message: "No se ha podido obtener el usuario"
                });
                return
            }
            let userFilter = new UserDto(user)
            req.logger.info("Usuario obtenido correctamente", userFilter)
            return res.status(200).send({
                success: "success",
                payload: userFilter
            });
        } catch(error){
            req.logger.error("Error al obtener el usuario", error)
        }
    }
    createUsers = async (req, res) => {
        try {
            const { body } = req.body
            let result = await userService.createUser(body)
            if(!result){
                req.logger.error("Error al crear el usuario")
                res.status(404).send({
                    status: "error",
                    message: "Error al crear el usuario"
                })
                return
            }
            res.logger.info("Usuario creado correctamente")
            return res.status(200).send({
                status: "success",
                message: "Usuario creado correctamente", result
            })
        } catch (error) {
            res.logger.error("No se ah podido crear el usuario ", error)
        }
    }
    updateUsers = async (req, res) => {
        try{
            let {uid} = req.params
            let body = req.body
            const result = await userService.updateUser(uid,body)
            if(!result){
                req.logger.error("Error al actualizar el usuario")
                res.status(404).send({
                    status: "error",
                    message: "Error al actualizar el usuario"
                });
                return
            };
            const userFilter = new UserDto(result)
            req.logger.info("Usuario actualizado correctamente", userFilter)
            return res.status(200).send({
                status: "success",
                message: "Usuario actualizado correctamente", userFilter
            })
        } catch(error){
            res.logger.error("No se ah podido actualizar el usuario ", error)
        }
    }
    roleUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await userService.getUser(uid)
            if(!user){
                req.logger.error("Error al obtener el usuario")
                res.status(404).send({
                    status: "error",
                    message: "No se ha podido obtener el usuario"
                });
                return
            }
        const documentsUploaded = await userService.checkDocs(uid);
        if (documentsUploaded){
            const updatedUser = await userService.updateRole(uid, "premium");
            if (!updatedUser === "premium") {
                req.logger.error("Error al obtener el usuario")
                res.status(400).send({
                    status: 'error',
                    message: 'Error al actualizar el usuario' });
                    return
            }
            req.logger.info('Usuario actualizado a premium');
            return res.status(200).send({
                status: 'success',
                message: 'Usuario actualizado a premium'
            });
        } else {
            req.logger.error("El usuario no cuenta con los permisos necesarios")
            res.status(400).send({
                status: 'error',
                message: 'no cuenta con los documentos requeridos antes de actualizar a premium'
            });
            return
        }
        } catch (error) {
            req.logger.error('Error al cambiar el rol del usuario:', error);
        }
    };
    profileUser = async (req, res) => {
        try {
            const {first_name, _id, role, email} = req.user
            if(!req.user){
                req.logger.error("El usuario no ingreó con su cuenta")
                res.status(400).send({
                    status: 'error',
                    message: 'Neceita loguearse para acceder a su perfil'
                });
                return
            }
            let admin = false
            if(req.user.role === "admin"){
                admin = true
            }
            
            let notPremiumOrAdmin = true
            if(req.user.role === "premium" || req.user.role === "admin"){
                notPremiumOrAdmin = false
            }

            res.render('myProfile', {
                id: _id,
                name: first_name,
                role: role,
                email: email,
                updateUser: notPremiumOrAdmin,
                isAdmin: admin
            });

        } catch (error) {
            req.logger.error('Error al cargar el perfil', error);
        }
    }

    uploadDocuments = async (req, res) =>{
        const { uid } = req.params
        const documents = req.file;
        const user = await userService.getUser(uid)
        if(!user){
            req.logger.error("No se encontró el usuario")
            res.status(404).send({
                status: 'error',
                message: 'No se cargaron los archivos'
            });
            return
        };
        if(!documents){
            req.logger.error("No se se subió el documento")
            res.status(400).send({
                status: 'error',
                message: 'No se cargaron los archivos'
            });
            return
        };
        const userDocFiles = await userService.uploadFilesDocument(uid, documents)
        if(!userDocFiles){
            req.logger.error("Error al subir el archivo")
            res.status(400).send({
                status: 'error',
                message: 'No se cargaron los archivos'
            });
            return
        };
        req.logger.info("Documento subidos exitosamente")
        return res.status(200).send({status: "success", message: "Documento subido correctamente"})
    }

    uploadProdImage = async (req, res) => {
        try {
            const { uid } = req.params
            const fileImage = req.file
            const user = await userService.getUser(uid)
            if(!user){
                req.logger.error("No se encontró el usuario")
                res.status(404).send({
                    status: 'error',
                    message: 'No se cargaron los archivos'
                });
                return
            };
            if(!fileImage){
                req.logger.error("Error a subir el archivo")
                res.status(400).send({
                    status: 'error',
                    message: 'No se cargó la imagen de perfil'
                });
                return
            };
            req.logger.info("Imagen subida correctamente")
            return res.status(200).send({
                status: "success",
                message: "Imagen de producto subida correctamente"
            })
        } catch (error) {
            req.logger.error("Error al subir la imagen de producto", error)
        }
    }
    uploadProfileImage = async (req, res) => {
        try {
            const { uid } = req.params
            const fileImage = req.file
            const user = await userService.getUser(uid)
            if(!user){
                req.logger.error("No se encontró el usuario")
                res.status(404).send({
                    status: 'error',
                    message: 'No se subió el archivo'
                });
                return
            };
            if(!fileImage){
                req.logger.error("Error a subir el archivo")
                res.status(400).send({
                    status: 'error',
                    message: 'No se cargó la imagen de producto'
                });
                return
            };
            req.logger.info("Imagen subida correctamente")
            return res.status(200).send({
                status: "success",
                message: "Imagen de perfil subida correctamente"
            })
        } catch (error) {
            req.logger.error("Error al subir la imagen de perfil", error)
        }
    }
    deleteUser = async (req, res) => {
        try{
            let { uid } = req.params
            const user = userService.deleteUser(uid)
            if(!user){
                req.logger.error("No se encontró el usuario")
                res.status(404).send({
                    status: 'error',
                    message: 'No se eliminó el usuario'
                });
                return
            };
        } catch(error){
            req.logger.error("No se eliminó el usuario", error)
        }
    }

    expiratedAccount = async (req, res) => {
        try {
            const expirationDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            const inactiveUsers = await userService.lastLogin(expirationDate);
            if(!inactiveUsers){
                req.logger.info("No se encontraron usuarios inactivos")
                res.status(200).send({
                    status: "success",
                    message: "No se encontraron usuarios inactivos"
                });
                return
            };
            for (const user of inactiveUsers) {
                await sendEmailExpirateAccount(user.username, 'Cuenta eliminada por inactividad', user.first_name, user.last_connection);
                await userService.deleteUser(user._id);
            };

        } catch (error) {
            req.logger.error("No se eliminaron los usuarios", error)
        }
    }
}
module.exports = new UserController()

