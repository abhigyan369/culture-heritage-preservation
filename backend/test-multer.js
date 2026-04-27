const express = require('express');
const multer = require('multer');
const request = require('supertest');
const FormData = require('form-data');

const app = express();
const upload = multer();

app.post('/test', upload.none(), (req, res) => {
  res.json(req.body);
});

async function run() {
  const form = new FormData();
  form.append('location[address]', '123 Main St');
  form.append('name', 'Test Name');
  
  const res = await request(app)
    .post('/test')
    .set(form.getHeaders())
    .send(form.getBuffer().toString('binary'));
    
  console.log('Result:', res.body);
}

run();
