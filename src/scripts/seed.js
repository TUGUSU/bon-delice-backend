require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');

// frotend ees restaurants.json iig backend/src/scripts/data/ ruu huulah
const data = require('./data/restaurants.json');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');

    const restaurants = data.restaurants.map(({ id: _id, isFavorite: _fav, ...rest }) => rest);
    await Restaurant.insertMany(restaurants);
    console.log(`Seeded ${restaurants.length} restaurants`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
