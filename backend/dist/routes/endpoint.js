"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_1 = require("../data/question");
const router = express_1.default.Router();
router.post('/getQuestion', async (req, res) => {
    try {
        const body = req.body; // ✅ Get id from request body
        const questionId = body?.id;
        // ✅ If questionId is number (e.g., 0), this will work
        const question = question_1.questions[questionId];
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ question });
    }
    catch (err) {
        console.error(`Error from the server: ${err}`);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
