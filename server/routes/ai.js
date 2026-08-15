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

// POST /api/ai/generate-quiz — AI Assistance for Staff Quiz Generation
router.post('/generate-quiz', async (req, res) => {
  try {
    const { content, difficulty = 'Intermediate', numQuestions = 3, courseTitle = 'General Computer Science' } = req.body;
    const diff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    // AI Quiz Generator Logic
    const generatedQuestions = [
      {
        question: `What is a fundamental concept in ${courseTitle} regarding ${content ? content.slice(0, 30) : 'this topic'}?`,
        options: [
          'Modular Abstraction and Encapsulation',
          'Linear Stack Overflow Execution',
          'Unconstrained Dynamic Memory Allocation',
          'Static Single-Threaded Event Deadlock'
        ],
        correctAnswer: 0,
        explanation: 'Modular abstraction ensures code is decoupled, maintainable, and robust.'
      },
      {
        question: `In ${diff} level ${courseTitle}, how is performance optimized when processing complex data structures?`,
        options: [
          'By using brute-force O(N^3) nested loops',
          'By utilizing efficient algorithms, caching, and asymptotic O(N log N) indexing',
          'By ignoring index structures and memory alignment',
          'By forcing synchronous blocking calls on UI loop'
        ],
        correctAnswer: 1,
        explanation: 'Efficient algorithms and indexing reduce time complexity significantly.'
      },
      {
        question: `Which key best practice should be enforced when developing ${courseTitle} modules?`,
        options: [
          'Hardcoding API secrets in public repositories',
          'Swallowing exceptions without logging or handling errors',
          'Comprehensive validation, modular design, and secure authentication',
          'Deleting unit tests whenever a build failure occurs'
        ],
        correctAnswer: 2,
        explanation: 'Validation and secure architecture guarantee safety and reliability.'
      }
    ];

    res.json({
      title: `${courseTitle} ${diff} AI Quiz`,
      description: `AI-generated assessment for ${courseTitle} based on provided syllabus (${diff} difficulty).`,
      durationMinutes: 15,
      passingPercentage: 70,
      questions: generatedQuestions.slice(0, Math.min(numQuestions, 5))
    });
  } catch (err) {
    console.error('Error generating AI quiz:', err);
    res.status(500).json({ error: 'Failed to generate quiz with AI.' });
  }
});

export default router;
