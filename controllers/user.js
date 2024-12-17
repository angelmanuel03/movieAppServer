const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");


//Register a User

module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: 'Invalid email format' });
    }

    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long'});

    // If all needed requirements are achieved
    } else {

        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({
            message: 'Registered successfully',
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
    }
};


//User Login

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){

        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({ message: 'No email found'});
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({
                        message: 'Logged in successfully', 
                        access : auth.createAccessToken(result)
                    });
                } else {
                    //401 - unauthorized
                    return res.status(401).send({ message: 'Incorrect email or password'});
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    }else{
        return res.status(400).send({ message: 'Invalid email format' })
    }
};


//Get Profile

module.exports.getProfile = (req, res) => {
	console.log(req.user);
    return User.findById(req.user.id)
    .then(user => {


        if(!user){
            //if the user has an invalid token
            return res.status(403).send({ message: 'invalid signature'})
        }else{
            user.password = "";
            //For a get request, 200 means that the server processed the request successfully and returned a response back to the client without any errors
            return res.status(200).send(user);
        }
        
    })
    .catch(error => errorHandler(error, req, res));
};
