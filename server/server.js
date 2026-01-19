const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
    res.send('Hello from Node.js Backend!');
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Here is some data from the backend', localTime: new Date().toISOString() });
});

// Serve static files from the React client
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
