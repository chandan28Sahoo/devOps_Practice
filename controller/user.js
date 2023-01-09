

module.exports.getUser = (req,res) =>{
    try {
        res.send ({
            error: false,
            message: "Hello from Controller"
        })
    } catch (error) {
        return error;
    }
}