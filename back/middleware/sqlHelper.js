const sql = require("mssql");

sql.on("error", (err) => {
  console.log("SQL ERR:", err);
});

const sqlConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DBNAME,
  server: process.env.SQL_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 3000,
  },
  options: {
    trustServerCertificate: true, 
    // change to true for local dev / self-signed certs
  },
};

async function getSqlConfig() {
  return sqlConfig;
}

async function getDataTable(query) {
  try {
    let pool = await sql.connect(sqlConfig);
    let result = await pool
      .request()
      .query(query);
    return result.recordsets[0];
  } catch (err) {
    console.log("function getDataTable - TRY/CATCH ERR:", err);
  }
}

const sqlPool = async () => {
  let pool = await sql.connect(sqlConfig);
  return pool;
};

const execute = async (req, res, next) => { };

module.exports = { execute, getDataTable, getSqlConfig, sqlPool };
