import express, { Request, Response } from "express"; // ✅ Fix: Combined import statement

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send({
        "Message": "This is home route",
        "Greeting": "Hello user"
    });
});

router.get("/CvUpdate", (req: Request, res: Response) => {
    res.send({
        "Message": "this is CvUpdate page"
    });
});

export default router; 