class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    getUsers(){
        return this.dao.get()
    }
    getUser(pid){
        return this.dao.getById(pid)
    }
    getEmail(email){
        return this.dao.getByEmail(email)
    }
    createUser(newUser){
        return this.dao.create(newUser)
    }
    updateUserPassword(uid,newPassword){
        return this.dao.updateUserPassword(uid, newPassword)
    }
    lastConnection(uid, date){
        return this.dao.lastConnection(uid, date)
    }
    updateUser(pid){
        return this.dao.update(pid)
    }
    checkDocs(uid){
        return this.dao.checkDocs(uid)
    }
    updateRole(uid, newRole){
        return this.dao.updateRole(uid, newRole)
    }
    uploadFilesDocument(uid,documents){
        return this.dao.uploadFilesDocument(uid, documents)
    }
    deleteUser(uid){
        return this.dao.delete(uid)
    }
    lastLogin(expirationDate){
        return this.dao.lastLogin(expirationDate)
    }
}

module.exports = UserRepository