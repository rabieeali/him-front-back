
const path = require("path");

const sql = require("mssql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
require("dotenv").config();

const sqlHelper = require("../middleware/sqlHelper");

const handleLogin = async (req, res) => {

  //*get data from body
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are required!" });

  //*connect to DB
  let sqlConfig = await sqlHelper.getSqlConfig();
  let pool = await sql.connect(sqlConfig);
  let result = await pool
    .request()
    .input("username", sql.NVarChar(sql.MAX), user)
    .query("SELECT top(1) * FROM Users WHERE UserName=@username ");

  //*found user 
  const foundUser = result.recordsets[0]?.find(
    (person) => person.UserName === user
  );
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  //* evaluate password
  const match = await bcrypt.compare(pwd, foundUser.NewPass);
  if (match) {

    //* create JWTs
    const accessToken = jwt.sign(
      { username: foundUser.UserName, userid: foundUser.UserId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_COOKIE_TIMEOUT }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.UserName, userid: foundUser.UserId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_COOKIE_TIMEOUT }
    );

    //* set in db
    let insertedUserId = await insertRefreshToken(
      foundUser.UserId,
      refreshToken
    );

    console.log("insertedUserId", insertedUserId);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false, //true on server - false on develop
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json(
      
      {
        "status": 200,
        "message": "handleLogin successfully sent!",
        "AuthData": {
          "UserId": 1,
          "UserTypeName": "مدیر سیستم",
          "UserName": "30111111",
          "Name": "مدیر ارشد",
          "Family": "سیستم",
          "FullName": "سیستم - مدیر ارشد",
          "AccessToken": accessToken,
          "Forms": [
            0,
            8,
            9,
            15,
            16,
            17,
            19,
            22,
            20,
            18,
            21,
            23,
            10,
            11,
            12,
            24,
            25,
            26,
            27,
            13,
            14,
            7,
            2,
            1,
            4,
            3,
            5,
            6,
            28,
            29
          ],
          "Roles": [
            1,
            2,
            3,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            1,
            2,
            3,
            4,
            5,
            6,
            10,
            14
          ],
          "PlaceGroups": [
            3,
            5,
            17,
            18,
            37,
            39,
            48,
            49,
            50,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            12,
            13,
            14,
            15,
            17,
            18,
            37,
            39
          ]
        }
      }
      
      
    );
    
  } else {
    res.sendStatus(401);
  }
};

async function resaveNewPass() {
  let sqlConfig = await sqlHelper.getSqlConfig();
  let pool = await sql.connect(sqlConfig);
  let result1 = await pool
    .request()
    //.input("username", sql.NVarChar(sql.MAX), user)
    //.input("password", sql.NVarChar(sql.MAX), pwd)
    .query("SELECT  * FROM Users WHERE newPass is null  ");

  result1.forEach((user) => {
    changePass(user.UserId, user.NationalCode);
  });
}

async function changePass(userId, nationalCode) {
  let sqlConfig = await sqlHelper.getSqlConfig();
  let pool = await sql.connect(sqlConfig);
  const hashedPwd = await bcrypt.hash(nationalCode, 10);
  let result = await pool
    .request()
    .input("newPass", sql.NVarChar(sql.MAX), hashedPwd)
    .input("userId", userId)
    .query(
      "Update Users set newPass=@newPass where userId=@userId Select @userId"
    );

  console.log("resavePass", userId);
}

async function insertRefreshToken(userId, token) {
  let sqlConfig = await sqlHelper.getSqlConfig();
  let pool = await sql.connect(sqlConfig);

  let result = await pool
    .request()
    .input("token", sql.NVarChar(sql.MAX), token)
    .input("userId", userId)
    .query(
      " Delete from RefreshTokenList where UserId=@userId " +
      " INSERT INTO RefreshTokenList (UserId,Token) select @userId,@token select @userId as value "
    );

  return result.recordsets[0][0].value;
}

module.exports = { handleLogin };
