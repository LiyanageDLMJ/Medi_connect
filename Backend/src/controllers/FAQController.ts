import FAQ from "../models/FAQ";
import { Request, Response } from "express";

export const getFaqs = async (req: Request, res: Response) => {
  const faqs = await FAQ.find().sort({ createdAt: -1 });
  res.json(faqs);
};

export const addFaq = async (req: Request, res: Response) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ error: "Missing fields" });
  const faq = new FAQ({ question, answer });
  await faq.save();
  res.status(201).json(faq);
};

export const updateFaq = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  const faq = await FAQ.findByIdAndUpdate(id, { question, answer }, { new: true });
  if (!faq) return res.status(404).json({ error: "FAQ not found" });
  res.json(faq);
};

export const deleteFaq = async (req: Request, res: Response) => {
  const { id } = req.params;
  const faq = await FAQ.findByIdAndDelete(id);
  if (!faq) return res.status(404).json({ error: "FAQ not found" });
  res.json({ success: true });
}; 