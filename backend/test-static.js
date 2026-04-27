const express = require('express');
const path = require('path');
const app = express();
app.use('/uploads/heritage-sites', express.static(path.join(__dirname, 'uploads/heritage-sites')));
app.get('/test', (req, res) => res.send('ok'));
app.listen(5002, () => console.log('started'));
