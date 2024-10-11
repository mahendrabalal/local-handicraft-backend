const mongoose = require('mongoose');
const Product = require('./models/Product.model'); 

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local-handicraft-backend';

// Connect to MongoDB
mongoose.connect('mongodb+srv://mahendrabalalport:kathmandu55AB@cluster0.csrbs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    return seedProducts();
  })
  .then(() => {
    console.log('Seeding Completed');
    return mongoose.connection.close(); 
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    mongoose.connection.close();
  });

// Function to seed products
async function seedProducts() {
  try {
    // Define the products to be seeded
    const products = [
        {
            name: 'Handmade Wooden Bowl',
            description: 'Beautiful handcrafted wooden bowl, ideal for serving and decoration.',
            price: 22.99,
            imageUrl: 'https://i.etsystatic.com/25531572/r/il/11a52d/2902491484/il_570xN.2902491484_39hx.jpg',
            category: 'Woodworking',
            stock: 10,
          },
          {
            name: 'Embroidered Throw Pillow',
            description: 'Hand-embroidered throw pillow with intricate designs for a cozy touch.',
            price: 18.75,
            imageUrl: 'https://images.thdstatic.com/productImages/e4731742-e43e-4f6f-b53b-04430f319980/svn/levtex-home-throw-pillows-v54630p-b-64_600.jpg',
            category: 'Textiles',
            stock: 20,
          },
          {
            name: 'Handwoven Wool Blanket',
            description: 'Warm and soft handwoven wool blanket, perfect for chilly nights.',
            price: 45.00,
            imageUrl: 'https://www.elleihome.com/cdn/shop/products/Ellei_Home_Handmade_Merino_Wool_Blankets-21_300x.jpg?v=1670506899',
            category: 'Textiles',
            stock: 12,
          },
          {
            name: 'Ceramic Tea Set',
            description: 'Elegant ceramic tea set with hand-painted designs, includes teapot and cups.',
            price: 55.99,
            imageUrl: 'http://example.com/tea-set.jpg',
            category: 'Pottery & Ceramics',
            stock: 8,
          },
          {
            name: 'Handcrafted Leather Journal',
            description: 'Genuine leather journal with hand-bound pages, perfect for writing and sketching.',
            price: 40.00,
            imageUrl: 'http://example.com/leather-journal.jpg',
            category: 'Leatherwork',
            stock: 15,
          },
          {
            name: 'Macrame Wall Hanging',
            description: 'Intricately knotted macrame wall hanging, ideal for boho-themed decor.',
            price: 35.50,
            imageUrl: 'http://example.com/macrame-wall.jpg',
            category: 'Textiles',
            stock: 18,
          },
          {
            name: 'Hand-carved Wooden Figurine',
            description: 'Unique hand-carved wooden figurine, perfect for display and collection.',
            price: 28.00,
            imageUrl: 'http://example.com/wooden-figurine.jpg',
            category: 'Woodworking',
            stock: 25,
          },
          {
            name: 'Beaded Necklace',
            description: 'Beautifully crafted beaded necklace with vibrant colors and patterns.',
            price: 12.99,
            imageUrl: 'http://example.com/beaded-necklace.jpg',
            category: 'Jewelry Making',
            stock: 30,
          },
          {
            name: 'Hand-painted Wooden Sign',
            description: 'Charming hand-painted wooden sign, perfect for personalized home decor.',
            price: 24.50,
            imageUrl: 'http://example.com/wooden-sign.jpg',
            category: 'Woodworking',
            stock: 20,
          },
          {
            name: 'Rustic Clay Pot',
            description: 'Authentic rustic clay pot, great for indoor plants or as a decorative piece.',
            price: 27.75,
            imageUrl: 'http://example.com/clay-pot.jpg',
            category: 'Pottery & Ceramics',
            stock: 14,
          },
          {
            name: 'Hand-dyed Silk Scarf',
            description: 'Luxurious hand-dyed silk scarf with vibrant colors and patterns.',
            price: 32.00,
            imageUrl: 'http://example.com/silk-scarf.jpg',
            category: 'Textiles',
            stock: 22,
          },
          {
            name: 'Handcrafted Wooden Spoon Set',
            description: 'Set of three handcrafted wooden spoons, perfect for cooking and serving.',
            price: 19.50,
            imageUrl: 'http://example.com/wooden-spoons.jpg',
            category: 'Woodworking',
            stock: 17,
          },
          {
            name: 'Ceramic Wall Planter',
            description: 'Stylish ceramic wall planter, ideal for growing small plants or herbs.',
            price: 29.99,
            imageUrl: 'http://example.com/wall-planter.jpg',
            category: 'Pottery & Ceramics',
            stock: 16,
          },
          {
            name: 'Handmade Woolen Mittens',
            description: 'Cozy handmade woolen mittens to keep your hands warm in the winter.',
            price: 15.75,
            imageUrl: 'http://example.com/woolen-mittens.jpg',
            category: 'Textiles',
            stock: 30,
          },
          {
            name: 'Handcrafted Silver Ring',
            description: 'Elegant handcrafted silver ring with intricate designs.',
            price: 48.00,
            imageUrl: 'http://example.com/silver-ring.jpg',
            category: 'Jewelry Making',
            stock: 12,
          },
          {
            name: 'Woven Rattan Lamp Shade',
            description: 'Beautifully woven rattan lamp shade that adds a natural touch to any room.',
            price: 37.50,
            imageUrl: 'http://example.com/rattan-lamp.jpg',
            category: 'Baskets',
            stock: 10,
          },
          {
            name: 'Handcrafted Ceramic Mug',
            description: 'Unique handcrafted ceramic mug, perfect for your morning coffee or tea.',
            price: 21.00,
            imageUrl: 'http://example.com/ceramic-mug.jpg',
            category: 'Pottery & Ceramics',
            stock: 22,
          },
          {
            name: 'Handmade Soap Dish',
            description: 'Elegant handmade soap dish, crafted from natural materials.',
            price: 16.50,
            imageUrl: 'http://example.com/soap-dish.jpg',
            category: 'Pottery & Ceramics',
            stock: 18,
          },
          {
            name: 'Macrame Plant Hanger',
            description: 'Stylish macrame plant hanger for displaying your favorite plants.',
            price: 26.75,
            imageUrl: 'http://example.com/macrame-hanger.jpg',
            category: 'Textiles',
            stock: 15,
          },
          {
            name: 'Hand-carved Wooden Jewelry Box',
            description: 'Beautifully hand-carved wooden jewelry box with intricate designs.',
            price: 58.00,
            imageUrl: 'http://example.com/jewelry-box.jpg',
            category: 'Woodworking',
            stock: 8,
          },
          {
            name: 'Handcrafted Ceramic Vase',
            description: 'Artisan-crafted ceramic vase with unique patterns and colors.',
            price: 34.99,
            imageUrl: 'http://example.com/ceramic-vase.jpg',
            category: 'Pottery & Ceramics',
            stock: 14,
          },
          {
            name: 'Beaded Bracelets Set',
            description: 'Set of three beaded bracelets, each with a different design.',
            price: 18.00,
            imageUrl: 'http://example.com/beaded-bracelets.jpg',
            category: 'Jewelry Making',
            stock: 25,
          },
          {
            name: 'Handmade Quilted Table Runner',
            description: 'Elegant quilted table runner handmade with traditional techniques.',
            price: 29.99,
            imageUrl: 'http://example.com/table-runner.jpg',
            category: 'Textiles',
            stock: 12,
          },
          {
            name: 'Handwoven Jute Rug',
            description: 'Durable and eco-friendly handwoven jute rug, perfect for any room.',
            price: 49.00,
            imageUrl: 'http://example.com/jute-rug.jpg',
            category: 'Textiles',
            stock: 10,
          }
    ];

    // Clear existing data (optional)
    await Product.deleteMany(); // Uncomment if you want to clear existing data

    // Insert the new data
    await Product.insertMany(products);

    console.log('Products have been seeded successfully.');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}
