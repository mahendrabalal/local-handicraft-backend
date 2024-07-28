const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const productSchema = new Schema({

    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 }
  }, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  });
  
  // Create the model from the schema
  const Product = mongoose.model('Product', productSchema);

  module.exports = Product;