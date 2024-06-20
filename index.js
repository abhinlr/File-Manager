import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import session from "express-session";
import methodOverride from "method-override";
import mongoDbSession from "connect-mongodb-session";

import connectDB from "./src/config/db.js";
import "./src/config/passport.js";
import authRoute from "./src/routes/auth.js";
import folderRoute from "./src/routes/folder.js";
import fileRoute from "./src/routes/file.js";

const app = express();

const port = process.env.PORT || 5000;
const sessionStore = new mongoDbSession(session)({
    uri: process.env.MONGO_URI,
    collection: "sessions"});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
        httpOnly:true,
        sameSite: 'none',
        secure: false
    },
    store: sessionStore,
    proxy:true,
}));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

connectDB().then(r => console.log("Connected to MongoDB")).catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/folder", folderRoute);
app.use("/api/file", fileRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});