import express from "express";
import logger from "morgan";
import path from "path";
import dotenv from "dotenv";
import createHttpError from "http-errors";
import {existsSync, mkdirSync} from "fs";
import cors from 'cors';
import { dirname } from "path";
import { fileURLToPath } from "url";
import {Server} from 'socket.io';

// routers
import indexRoutes from "./routes/index.js";
import userRoutes from "./routes/users.js";
import feedRoutes from "./routes/feed.js";
import apiRoutes from "./routes/api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

if (!existsSync(path.join(__dirname, process.env.DB_DIRNAME))) {
    mkdirSync(path.join(__dirname, process.env.DB_DIRNAME));
}

// ensure uploads and uploads/images exist
const uploadsDir = path.join(__dirname, 'uploads');
const uploadsImagesDir = path.join(uploadsDir, 'images');

if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir);
}
if (!existsSync(uploadsImagesDir)) {
    mkdirSync(uploadsImagesDir);
}

const app = express();

// views engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public', process.env.BUILD)));
app.use('/fontawesome', express.static(path.join(__dirname, 'public', 'fontawesome')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/feed", feedRoutes);
app.use("/api", apiRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createHttpError(404));
});

// error handler todo: раскомментировать
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res["locals"].message = err["message"];
    res["locals"].error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err["status"] || 500);
    return res.render('error', {error: err});
});

// app.use(function(err, req, res, next) {
//     // log full error to console for debugging
//     try {
//         console.error('Express error:', err && err.stack ? err.stack : err);
//     } catch (e) {
//         // ignore logging errors
//     }
//
//     res.locals.message = err && err.message ? err.message : 'Internal Server Error';
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.status(err && err.status ? err.status : 500);
//     return res.render('error');
// });

export default app