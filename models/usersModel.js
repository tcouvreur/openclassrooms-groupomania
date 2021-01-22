/* global database */

/**
 * [addUser description]
 *
 * @param   {Object}  data  [data description]
 *
 * @return  {[type]}        [return description]
 */
async function addUser(data) {
    await database.insertOne(data);
}

module.exports.addUser=addUser;