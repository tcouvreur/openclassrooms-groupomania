const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost', 
     user:'root', 
     password: 'root',
     database: 'groupomania',
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

    for (const [key, value] of Object.entries(data)) {
        element += `${key}`;
        elementValues.push(value);
        interrogationPoint += '?';
        if (elementValues.length > 1) {
            interrogationPoint += ',';
            element += ',';
        }
    }

    // let request =VALUES (${elementValues})`;

    const res = await connection.query( `INSERT INTO ${table} (${element}) values (${interrogationPoint}) `, elementValues);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
}

module.exports.connect=connect;
module.exports.disconnect=disconnect;
module.exports.insertOne=insertOne;