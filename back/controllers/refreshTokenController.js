const sqlHelper = require("../middleware/sqlHelper");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {

  const cookies = req.cookies;
  console.log("sep:", cookies)

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  console.log(refreshToken)
  let sqlConfig = await sqlHelper.getSqlConfig();
  let pool = await sql.connect(sqlConfig);
  let result = await pool
    .request()
    .input("Token", sql.NVarChar(sql.MAX), refreshToken)
    .query("SELECT top(1) UserId FROM vRefreshTokenList WHERE Token=@Token ");

  const foundUser = result.recordsets[0]?.find((person) => person.UserId > 0);
  //const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.UserId !== decoded.userid) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username, userid: decoded.userid },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_COOKIE_TIMEOUT }
    );
    res.json({ AccessToken: accessToken });
  });
};

module.exports = { handleRefreshToken };
