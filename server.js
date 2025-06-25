const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the current directory
app.use(express.static('.'));

// Handle routes for your HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/comments', (req, res) => {
  res.sendFile(path.join(__dirname, 'comments.html'));
});

app.get('/timeline', (req, res) => {
  res.sendFile(path.join(__dirname, 'timeline.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});