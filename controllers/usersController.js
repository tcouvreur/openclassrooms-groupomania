const model = require('../models/usersModel');

exports.login = (request, response, next)=> {
    try {
        model.addUser({
            'name': 'Thomas',
            'password': 'test',
            'email': 'test@gmail.com',
            'role': 1
        });
    } catch (err) {
        throw (err);
    }

    response.send('coucou');
}