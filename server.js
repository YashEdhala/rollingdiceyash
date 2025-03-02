// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Dice rolling function
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}


app.get('/api/roll/:sides', (req, res) => {
    const sides = parseInt(req.params.sides);
    if (isNaN(sides) || sides < 1) {
        return res.status(400).json({ error: 'Invalid number of sides' });
    }
    const result = rollDice(sides);
    res.json({ sides, result });
});

// Roll multiple dice
app.post('/api/roll', (req, res) => {
    const { count, sides } = req.body;
    if (!count || !sides || count < 1 || sides < 1) {
        return res.status(400).json({ error: 'Invalid count or sides' });
    }
    
    const results = Array.from({ length: count }, () => rollDice(sides));
    res.json({
        count,
        sides,
        results,
        total: results.reduce((sum, num) => sum + num, 0)
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve the test HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
