

module.exports.getUser = (req,res) =>{
    try {
        res.send ({
            error: false,
            message: "Hello from Controller/user-service...okey"
        })
    } catch (error) {
        return error;
    }
}
