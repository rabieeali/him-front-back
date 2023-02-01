const path = require("path");
const cors = require("cors");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload")

const { logger } = require("./middleware/logEvents");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT.js");
//---------------------------------------------------------------------------------------------


//*--custom middleware logger------------------------------------------------------------------
app.use(logger);

//*--Handle options credentials check - before CORS!-------------------------------------------
//*--and fetch cookies credentials requirement
app.use(credentials);

//*--Cross Origin Resource Sharing-------------------------------------------------------------
app.use(cors(corsOptions));

//*--middleware for cookies--------------------------------------------------------------------
app.use(cookieParser());

//*--built-in middleware to handle urlencoded form data----------------------------------------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//*--File Upload Middleware--------------------------------------------------------------------
app.use(fileUpload());


//*--routes------------------------------------------------------------------------------------
app.use("/", require("./routes/api/root"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refresh", require("./routes/api/refresh"));
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));


app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});


const PORT = process.env.PORT || 3500
app.listen(process.env.PORT || 3500, () => console.log(`Server running on port ${PORT}`));
