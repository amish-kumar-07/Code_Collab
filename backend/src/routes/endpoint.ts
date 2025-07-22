import express from 'express';
import { questions } from '../data/question';

const router = express.Router();

router.post('/getQuestion', async (req, res) => {
  try {
    const body = req.body; // ✅ Get id from request body
    const questionId = body?.id;

    // ✅ If questionId is number (e.g., 0), this will work
    const question = questions[questionId];


    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ question });
  } catch (err) {
    console.error(`Error from the server: ${err}`);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
