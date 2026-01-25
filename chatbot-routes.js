const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();


// Initialize Google GenAI client
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

// Get user context from database
const getUserContext = async (userId, queryCollection, recommendationCollection) => {
    try {
        const userQueries = await queryCollection.find({ "posted_by.email": userId }).toArray();
        const userRecommendations = await recommendationCollection
            .find({ "recommended_by.email": userId })
            .toArray();

        const recentQueries = userQueries
            .slice(-5)
            .map(q => `"${q.product_name}" - ${q.query_title}`)
            .join(', ');

        const recentRecommendations = userRecommendations
            .slice(-5)
            .map(r => `"${r.product_title}" (${r.title})`)
            .join(', ');

        return {
            totalQueries: userQueries.length,
            totalRecommendations: userRecommendations.length,
            recentQueries: recentQueries || 'No queries yet',
            recentRecommendations: recentRecommendations || 'No recommendations yet',
        };
    } catch (error) {
        console.error('Error fetching user context:', error);
        return {
            totalQueries: 0,
            totalRecommendations: 0,
            recentQueries: 'Unable to fetch',
            recentRecommendations: 'Unable to fetch',
        };
    }
};

module.exports = (queryCollection, recommendationCollection, verifyToken) => {
    router.post('/chat', verifyToken, async (req, res) => {
        try {
            const { message } = req.body;
            const userId = req.user.email;

            // Get user's history
            const userContext = await getUserContext(
                userId,
                queryCollection,
                recommendationCollection
            );

            // Build context-aware prompt
            const systemPrompt = `You are a helpful and friendly product recommendation assistant for the ProdRec platform.

📊 User Information:
- Total Queries Asked: ${userContext.totalQueries}
- Recommendations Received: ${userContext.totalRecommendations}
- Recent Queries: ${userContext.recentQueries}
- Recent Recommendations: ${userContext.recentRecommendations}

🎯 Your Responsibilities:
1. Help users find the best product recommendations
2. Guide them through the ProdRec platform features (Add Query, View Recommendations, etc.)
3. Answer questions about how queries and recommendations work
4. Provide personalized product suggestions based on their history
5. Be conversational, friendly, and supportive
6. Keep responses concise (2-3 sentences max unless asked for more details)

💡 ProdRec Features to help with:
- Adding queries about products they want recommendations for
- Viewing recommendations from the community
- Managing their own queries and recommendations
- Searching for products across categories
- Tracking their recommendation history

Remember: Always be helpful, personalized, and reference their history when relevant. If they ask about features, explain how to use them on ProdRec.`;

            // Use GoogleGenAI SDK with gemini-3-flash-preview
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `${systemPrompt}\n\nUser Message: ${message}`,
            });

            const text = response.text;

            res.json({
                success: true,
                reply: text,
            });
        } catch (error) {
            console.error('Chatbot error:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing request',
                error: error.message,
            });
        }
    });

    return router;
};
