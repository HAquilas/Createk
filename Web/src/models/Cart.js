import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La quantité doit être au moins 1']
  }
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Mettre à jour la date de modification
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Méthode pour calculer le total du panier
cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.product')
  return this.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
}

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema)

export default Cart 