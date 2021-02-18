const model = require('../models/usersModel');
const bcrypt = require('bcrypt');

/**
 * [login description]
 *
 * @param   {module:http.IncomingMessage}  request           la requete
 * @param   {Object}                       request.body
 * @param   {String}                       request.body.name
 * @param   {module:http.ServerResponse}   response          la réponse  
 * @param   {function}  next     
 *
 * @return  {void|Error} 
 */
exports.register = (request, response, next) => {
    try {
        //TODO: crypter mdp et utiliser les vraies données du body
        bcrypt.hash(request.body.password, 10, async (err, result) => {
            const token=12;
            console.log("request", request.body);
            if (err) throw (err);
            try {
                await model.addUser({
                    'name': request.body.name,
                    'password': result,
                    'email': request.body.email,
                    'role': 1
                });
                response
                    .append("Authorization", "Bearer " + token)
                    .status(201)
                    .json({"succes":{}})
            }
            catch (error) {
                response.status(409).json({"failed" : error});
            }
        });

    } catch (err) {
        response.status(500).json({"failed" : err});
        throw (err);
    }
}

exports.login = async (request, response, next) => {

    try {
        //TODO: crypter mdp et utiliser les vraies données
        const user = await model.getUser({
            'email': 'test2@gmail.com'
        });
        bcrypt.compare(request.body.password, user.password);
        response
            .append("Authorization", "Bearer " + token)
            .status(201)
            .json({})
    } catch (err) {
        throw (err);
    }

    response.send('coucou');
}