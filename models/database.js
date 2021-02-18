const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: process.env.DB_HOST, 
     user: process.env.DB_USER, 
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     connectionLimit: 5
});

var connection;

async function asyncFunction() {
  try {
	const rows = await connection.query("SELECT 1 as val");
	console.log(rows); //[ {val: 1}, meta: ... ]
	const res = await connection.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
	throw err;
  }
}

async function connect(req, res, next) {
    try {
        connection = await pool.getConnection();
    } catch (err) {
        throw err;
    }
    next();
}

function disconnect(req, res, next) {
    if (connection) return connection.end();
    next();
}

async function insertOne(data, table, condition = {}) {
    let element = '';
    let elementValues = [];
    let interrogationPoint = '';
    const elems = Object.keys(data).length;

    for (const [key, value] of Object.entries(data)) {
        element += `${key}`;
        elementValues.push(value);
        interrogationPoint += '?';
        if (elementValues.length > 0 && elementValues.length < elems) {
            interrogationPoint += ',';
            element += ',';
        }
    }

    // let request =VALUES (${elementValues})`;

    const res = await connection.query( `INSERT INTO ${table} (${element}) values (${interrogationPoint}) `, elementValues);
    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
    return res;
}

/**
 * [async description]
 *
 * @param   {Object}                 data   [data description]
 * @param   {Object}                 [data.where] conditions de la recherche
 * @param   {Number}                 [data.limit] limite de la requete
 * @param   {String|Array|undefined} [data.select]  les éléments dont on a besoin
 * @param   {String}                 table  [table description]
 *
 * @return  {[type]}         [return description]
 */
async function select(data, table){
    let conditions ="";
    let dataWhere = [];

    if (data.select === undefined) data.select = "*";
    if (Array.isArray(data.select)) data.select = data.select.join(",");

    if (data.where !== undefined){
        let where = [];
        for (const [key, value] of Object.entries(data.where)) {
            where.push(`${key} = ?`);
            dataWhere.push(value);
        }
        conditions += " WHERE "+where.join(" AND ");
    }

    // console.log( `SELECT ${data.select} FROM ${table} ${conditions} `, dataWhere);
    const res = await connection.query( `SELECT ${data.select} FROM ${table} ${conditions} `, dataWhere);
    delete res.meta;
    return res;

}




module.exports.connect=connect;
module.exports.disconnect=disconnect;
module.exports.insertOne=insertOne;
module.exports.select=select;