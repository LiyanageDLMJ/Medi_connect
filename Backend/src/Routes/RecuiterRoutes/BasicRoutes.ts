import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) =>
     { res.send("This is home route"); });

router.get("/Job", (req: Request, res: Response) =>
     { res.send("this is Job page"); });
