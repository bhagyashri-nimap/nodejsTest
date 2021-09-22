var { userData } = require('../mongooseModel/User.js');
var async = require("async");
require('dotenv').config();
var _ = require('lodash');
var jwt = require("jsonwebtoken")
var jwtDecode = require("jwt-decode")
var sha256 = require("js-sha256").sha256
var jwtKey = process.env.JWT_KEY
exports.signUp = async function (data) {
     let saveUser
        const ifAlreadyUser = await userData.findOne({
            email: _.toLower(data.email)
        })

        if (ifAlreadyUser && ifAlreadyUser._id && ifAlreadyUser.email) {
            return {
                data: "Email Already Exist",
                value: false
            }
        }
        const ifAlreadyUserMobile = await userData.findOne({
            mobile: data.mobile
        })

        if (
            ifAlreadyUserMobile &&
            ifAlreadyUserMobile._id &&
            ifAlreadyUserMobile.mobile
        ) {
            return {
                data: "User Mobile No Already Exist",
                value: false
            }
        }
        let newUserObj = {
            name: data.name,
            email: _.toLower(data.email),
            mobile: data.mobile,
            password: sha256(data.password)
        }

        let userObj = new userData(newUserObj)
        saveUser = await userObj.save()
        let accessTokenOutput = generateAccessToken(
            saveUser
        )
        if (accessTokenOutput && !accessTokenOutput.value) {
            return {
                data: "Failed to Generate AccessToken",
                value: false
            }
        }else{
            let newObj = {
                accessToken: accessTokenOutput.data.accessToken,   
            }
            const userOutput = await userData.findByIdAndUpdate({
                _id: saveUser._id
            },
            {$set: newObj}, {new: true}
        )
        saveUser = await userOutput.save()    
        }
        if (saveUser && !saveUser._id) {
            return {
                data: "Something Went Wrong While Saving User",
                value: false
            }
        }
        return {
            data: accessTokenOutput.data,
            value: true
        }
},
exports.login = async function (data) {
    data.email = _.toLower(data.email)
        const checkUser = await userData.findOne({
            email: data.email
        })

        if (_.isEmpty(checkUser)) {
            return {
                data: "Incorrect Username or Password.",
                value: false
            }
        }
        let encryptedPassword = sha256(data.password)
        if (
            checkUser &&
            checkUser.password &&
            checkUser.password != encryptedPassword
        ) {
            return {
                data: "Incorrect Username or Password",
                value: false
            }
        }
        let accessTokenOutput = generateAccessToken(
            checkUser
        )
        if (accessTokenOutput && !accessTokenOutput.value) {
            return {
                data: "Failed to Generate AccessToken",
                value: false
            }
        }else{
            let newObj = {
                accessToken: accessTokenOutput.data.accessToken,   
            }
            const userOutput = await userData.updateOne({
                _id: checkUser._id
            },
            newObj   
        )
        if (userOutput && userOutput.nModified) {
            return {
                data: "Update Successfully",
                value: true
            }
        }  
        }
         return accessTokenOutput
},

 generateAccessToken=function(userAvailable) {
    console.log("userAvailable", userAvailable)
    let objToGenerateAccessToken = {
        _id: userAvailable._id,
        name: userAvailable.name,
        email: userAvailable.email,
        mobile: userAvailable.mobile
    }
    var token = jwt.sign(objToGenerateAccessToken, jwtKey)
    objToGenerateAccessToken.accessToken = token
    delete objToGenerateAccessToken._id
    return {
        data: objToGenerateAccessToken,
        value: true
    }
}


