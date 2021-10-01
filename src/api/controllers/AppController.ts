import {Express, Request, Response} from "express";
import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import Endpoints from "../V1Router";
import Uploader from "../UploadRouter";
import StaticRouter from "../StaticRouter";

export class AppController {

    constructor(app: Express) {
        app.use("/v1", Endpoints);
        app.use("/uploads", Uploader);
        app.use("/endpoints", StaticRouter);
        app.use(express.static(path.join(__dirname, "/../public")));
        app.set("trust proxy", "8.8.8.8");
        app.set("trust proxy", 1);
        app.use(express.urlencoded({ extended: false }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.get("/hosting", (req: Request, res: Response) => {
            return res.sendFile(path.join(__dirname + "/../public/hosting.html"));
        });
        app.use((req: Request, res: Response) => {
            const error = new Error("The requested URL was not found on our servers.");
            res.status(404).json({
                status: 404,
                message: error.message,
                timestamps: {
                    date: new Date().toLocaleString(),
                    unix: Math.round(+ new Date() / 1000),
                }
            });
        });
    }
}