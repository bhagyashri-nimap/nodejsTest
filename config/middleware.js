const jwt = require("jsonwebtoken")
require('dotenv').config();
var jwtKey = process.env.JWT_KEY
 var authenticateUser= async (req, res, next) => {
    if (req && req.headers && req.headers.accesstoken) {
        try {

            const decoded = jwt.verify(
                req.headers.accesstoken,
                jwtKey
            )
            req.user = decoded
            next()
        } catch (e) {
            res.status(401).send(e)
        }
    } else {
        res.status(401).send("Not Authorized")
    }
}
module.exports = {
    authenticateUser
}