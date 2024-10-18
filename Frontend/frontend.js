const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a simple route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ui.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Frontend server is running at http://localhost:${PORT}`);
});
