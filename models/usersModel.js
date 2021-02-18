/* global database */

/**
 * [addUser description]
 *
 * @param   {Object}  data  [data description]
 *
 * @return  {[type]}        [return description]
 */
async function addUser(data) {
    const exist = await getUser(data);
    if (exist.length > 0) throw("user already exists");
    return await database.insertOne(data, "users");
}

async function getUser(data) {
    return await database.select({where: {email:data.email}}, "users");
}

module.exports.addUser=addUser;
module.exports.getUser=getUser;