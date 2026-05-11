const mongoose = require('mongoose');//Өгөгдлийн бүтэц

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    price: { type: String },
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    emoji: { type: String },
    image: { type: String },
    imageAlt: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    category: {
      type: String,
      trim: true,
      default: 'other',
    },
    section: {
      type: String,
      trim: true,
      default: '',
    },
    distance: { type: Number },
    deliveryTime: { type: Number },
    priceRange: { type: String },
    isOpen: { type: Boolean, default: true },
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    hours: { type: String },
    weeklyHours: { type: Map, of: String },
    mapEmbed: { type: String },
    menu: { type: Map, of: [menuItemSchema] },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
