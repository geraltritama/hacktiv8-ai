import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

console.log("CEK API KEY:", process.env.GEMINI_API_KEY);

const app = express();
const upload = multer();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = 'gemini-2.5-flash';

app.use(express.json());

app.post('/generate-text', upload.none(), async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt
        });

        res.status(200).json({ 
            result: response.text 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message 
        });
    }
});

app.post('/generate-from-image', upload.single('image'), 
async (req, res) => {
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString('base64')

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {text: prompt, type: 'text'},
                {inlineData: {
                    data: base64Image,
                    mimeType: req.file.mimetype,
                }}
            ]
        })

        res.status(200).json({ result: response.text })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
})

app.post('/generate-from-document', upload.single('document'),
async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString('base64');

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {text: prompt ?? "Tolong buatkan ringkasan dari dokumen berikut:", type: 'text'},
                {inlineData: {
                    data: base64Document,
                    mimeType: req.file.mimetype,                }}
            ]
        })

        res.status(200).json({ result: response.text })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
});

app.post('/generate-from-audio', upload.single('audio'),
async (req, res) => {
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString('base64')
    
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {text: prompt ?? "Tolong buat transkrip dari audio berikut", type: 'text'},
                {inlineData: {
                    data: base64Audio,
                    mimeType: req.file.mimetype,
                }}
            ]
        })

        res.status(200).json({ result: response.text })
    }   catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
})

const PORT = 3000;
app.listen(3000, () => 
    console.log(`Server running on port ${PORT}`)
);