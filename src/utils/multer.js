const multer = require('multer')
const path = require("path")
const fs = require('fs');

//path configs
const profileImagePath = path.join(__dirname, "../public/uploads/profile/");
const productImagePath = path.join(__dirname, "../public/uploads/products/");
const documentsPath = path.join(__dirname, "../public/uploads/documents/");



const storage = multer.diskStorage({
    destination: async (req, file, cb)=>{
        const { uid } = req.params
        const userId = uid

        if (file.fieldname === 'profileImage') {
            userPath = path.join(profileImagePath, "user_" + userId);
        } else if (file.fieldname === 'productImage') {
            userPath = path.join(productImagePath, "product_" + userId);
        } else if (file.fieldname === 'identification') {
            userPath = path.join(documentsPath, "identification_" + userId);
        } else if (file.fieldname === 'ProofOfAddress') {
            userPath = path.join(documentsPath, "address_" + userId);
        } else if (file.fieldname === 'ProofOfStatus') {
            userPath = path.join(documentsPath, "status_" + userId);
        } else {
            cb(new Error('Tipo de archivo no válido'));
        }        
        try {
            fs.mkdir(userPath, (error) => {
                if (error) {
                    return req.logger.error("Error al crear la carpeta en la dirección:", userPath, error);
                }
                req.logger.info("Carpeta creada correctamente en la ruta: ", userPath)
            });
            cb(null, userPath);
        } catch (error) {
            cb(error, null)
        }
    },

    filename: (req, file, callback)=>{
        const nameAndExtension = `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
        callback(null, nameAndExtension)
    }
})

const uploader = multer({
    storage,
    onError: (err,next)=>{
        console.log("Error al guardar archivo por multer",err)
        next()
    }
})

module.exports={
    uploader
}
