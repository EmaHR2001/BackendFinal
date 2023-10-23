class UserDto {
    constructor(user){
        this.username = user.username
        this.email = user.email
        this.age = user.age
        this.role = user.role
    }
}

module.exports = {
    UserDto
}
