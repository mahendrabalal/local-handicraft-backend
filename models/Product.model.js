const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const productSchema = new Schema({

    name: { type: String, required: [true, 'Product name is required'] },
    description: { type: String, default: '' },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price must be a positive number'] },
    imageUrl: { type: String },
    category: { type: String,enum: ['Pottery & Ceramics', 'Leatherwork', 'Woodworking', 'Jewelry Making', 'Paper Crafts', 'Baskets', 'Textiles', 'Clothing'], default: 'Textiles'},
    stock: { type: Number, default: 0, min: [0, 'Stock cannot be negative']},
    sold: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 }, 

  }, 
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  });
  
  // Create the model from the schema
  const Product = mongoose.model('Product', productSchema);

  module.exports = Product;