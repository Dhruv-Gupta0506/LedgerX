const axios = require('axios');
const Expense = require('../models/Expense');
const { GoogleGenAI } = require('@google/genai');

// 1. Initialize the secure Google Gen AI handshake gateway instance
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

const createExpense = async (req, res) => {
    try {
        const { title, amount, category } = req.body;

        // --- PHASE 1: EXTERNAL COMMODITY CONVERSION MATH ---
        let assetTranslation = "Calculated at baseline market rates";

        try {
            const apiResponse = await axios.get(process.env.ASSET_API_URL);
            const goldRatePerRupee = apiResponse.data.rates.XAU;

            if (goldRatePerRupee) {
                // Conversion math: INR Amount * Ounces-per-Rupee * 31.1035 Grams-per-Ounce
                const totalOuncesSpent = amount * goldRatePerRupee;
                const totalGramsSpent = totalOuncesSpent * 31.1035;
                assetTranslation = `${totalGramsSpent.toFixed(2)} grams of pure Gold`;
            }
        } catch (apiError) {
            console.log("Precious metals tracking API down. Utilizing fallback variables.");
        }

        // --- PHASE 2: GOOGLE GEMINI AI EMBEDDED ROAST ENGINE ---
        let aiVibeCheckText = "The AI is currently calculating your financial sins.";

        try {
            if (process.env.AI_API_KEY) {
                const aiResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `A user named ${req.user.name} just logged a personal transaction on their budget manager ledger.
                    Transaction Details: Spent ₹${amount} on buying "${title}".
                    Commodity Scaling Value: This cash amount is mathematically equal to purchasing ${assetTranslation}.
                    
                    Objective: Generate a sharp, witty, highly sarcastic 1-sentence financial coaching reality-check roast. Remind them how skipping this purchase and stocking away the physical precious metal value instead would secure their future empire. Keep it strictly to one punchy, memorable sentence.`
                });

                if (aiResponse && aiResponse.text) {
                    aiVibeCheckText = aiResponse.text.trim();
                }
            }
        } catch (aiError) {
            console.log("AI completion connection drop:", aiError.message);
            aiVibeCheckText = "Your wallet survived the roast because our AI engine is currently on a coffee break.";
        }

        // --- PHASE 3: DATABASE ENTRY COMMIT ---
        const newExpense = await Expense.create({
            userId: req.user._id, // Fixed uppercase _Id typo to lowercase _id
            title: title,
            amount: amount,
            category: category,
            assetComparison: assetTranslation,
            aiVibeCheck: aiVibeCheckText
        });

        res.status(201).json(newExpense);

    } catch (err) {
        res.status(400).json({ err: err.message });
    }
};

const getExpenses = async (req, res) => {
    try {
        // Fixed uppercase _Id typo to lowercase _id
        const history = await Expense.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ message: 'error retrieving your expense' });
    }
};

module.exports = {
    createExpense,
    getExpenses
};