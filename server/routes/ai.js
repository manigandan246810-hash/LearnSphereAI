import express from 'express';

const router = express.Router();

// POST /api/ai/query — AI Assistant Academic Intelligence Response Endpoint
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    let replyText = "";
    if (query.includes("Summarize") || query.includes("PDF")) {
      replyText = "📄 **PDF Summary**: The Neural Networks chapter covers feedforward propagation, activation functions (ReLU, Sigmoid), cost functions (Cross-Entropy), and gradient descent optimization using backpropagation.";
    } else if (query.includes("Explain") || query.includes("Neural")) {
      replyText = "💡 **CNN Explanation**: Convolutional Neural Networks process grid-like data. Filters slide over input images to compute dot products, capturing low-level features (edges, textures) in early layers and high-level semantics (faces, objects) in deeper layers!";
    } else if (query.includes("Quiz") || query.includes("Question")) {
      replyText = "📝 **Generated AI Practice Quiz**:\n1. What is the gradient of ReLU for x > 0? (Ans: 1)\n2. Which layer reduces spatial dimensions? (Ans: Max Pooling)\n3. True/False: Dropout prevents overfitting during inference. (Ans: False, only during training!)";
    } else if (query.includes("Plan") || query.includes("Study")) {
      replyText = "📅 **Recommended Study Plan**:\n• Mon & Wed: 1.5h CNN PyTorch Assignment\n• Tue & Thu: 1h React Next.js Labs\n• Fri: Quiz Practice & Revision\n• Weekend: 2h Capstone Project building!";
    } else {
      replyText = `✨ Here is what I found regarding "${query}": I analyzed your registered course material in Artificial Intelligence and compiled key concepts, code snippets, and revision cards for you!`;
    }

    res.json({ reply: replyText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
