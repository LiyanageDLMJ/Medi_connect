import express from "express";
import { getFaqs, addFaq, updateFaq, deleteFaq } from "../controllers/FAQController";
const router = express.Router();

router.get("/", getFaqs);
router.post("/", addFaq);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export default router; 