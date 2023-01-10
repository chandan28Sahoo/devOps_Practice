

module.exports.getUser = (req,res) =>{
    try {
        res.send ({
            error: false,
            message: "Hello from Controller/user-service"
        })
    } catch (error) {
        return error;
    }
}
