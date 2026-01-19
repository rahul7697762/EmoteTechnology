const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Node.js Backend!');
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Here is some data from the backend', localTime: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
