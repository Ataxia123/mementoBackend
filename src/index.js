import express from "express";
import passport from "passport";
import { loginRouter } from "./routes/bnet.js";
import { dbRouter } from "./routes/dbRoutes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./middlewares/bnet.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from 'path';
import xmlparser from 'express-xml-bodyparser';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const app = express();
app.use(xmlparser());
console.log(__dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(
  session({
    secret: 'mementoMorimomos',
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  cors({
    origin: [process.env.URL],   // replace with your frontend url
    credentials: true,
    optionsSuccessStatus: 200
  })
);
app.use(passport.initialize());
app.use(passport.session());



app.use("/oauth", loginRouter);
app.use("/api", dbRouter);

// Viewer routes

app.listen(process.env.PORT || 3000, () => console.log(`server in http://localhost:3000`));


