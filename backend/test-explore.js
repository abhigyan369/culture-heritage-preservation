const mongoose = require('mongoose');
const exploreController = require('./src/controllers/exploreController');

// Mock request and response
const req = {
  query: {
    page: 1,
    limit: 10
  }
};

const res = {
  status: function(s) {
    this.statusCode = s;
    return this;
  },
  json: function(data) {
    console.log('Success!', data.count, 'items returned.');
  }
};

const next = function(err) {
  console.log('Error:', err.message);
};

async function run() {
  await mongoose.connect('mongodb://localhost:27017/culture_heritage');
  await exploreController.searchSites(req, res, next);
  mongoose.connection.close();
}

run();
