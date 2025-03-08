//Under development

import { PORT, createDB, corsOptions } from "./config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express, { json, urlencoded, Application, Request, Response } from "express";
import { notFound, errHandler } from "./middlewares";
import allRoutes from "./routes";
import path from 'path';
import { monkeyPatchFaceAPI } from './utils/faceapi.env';
// import '@tensorflow/tfjs-node';

monkeyPatchFaceAPI();
createDB();

const app: Application = express();

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Serve face-api.js models
app.use('/models', express.static(path.join(__dirname, '../public/models')))
app.use("/v1", allRoutes);
app.use(notFound);
app.use(errHandler);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});