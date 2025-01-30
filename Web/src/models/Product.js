import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nom du produit est requis'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description du produit est requise'],
  },
  price: {
    type: Number,
    required: [true, 'Prix du produit est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  imageUrls: {
    type: [String],
    required: [true, 'Au moins une image est requise'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Au moins une image est requise'
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendeur est requis'],
  },
  stock: {
    type: Number,
    required: [true, 'Stock est requis'],
    min: [0, 'Le stock ne peut pas être négatif'],
  },
  category: {
    type: String,
    required: [true, 'Catégorie est requise'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Mettre à jour updatedAt avant chaque sauvegarde
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; 