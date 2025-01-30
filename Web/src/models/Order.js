import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La quantité doit être au moins 1'],
  },
  price: {
    type: Number,
    required: true,
  },
});

const shippingDetailsSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  additionalInfo: String,
});

const trackingSchema = new mongoose.Schema({
  carrier: String,
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  updates: [{
    status: String,
    location: String,
    timestamp: Date,
    description: String
  }]
});

const returnRequestSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
  }
});

const historyEntrySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: String,
  reason: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: String
});

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingDetails: shippingDetailsSchema,
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  tracking: trackingSchema,
  returnRequest: returnRequestSchema,
  cancellationReason: String,
  history: [historyEntrySchema],
  estimatedDeliveryDate: Date,
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  review: reviewSchema,
});

// Mettre à jour updatedAt avant chaque sauvegarde
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour vérifier si une commande peut être annulée
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'paid'].includes(this.status)
}

// Méthode pour vérifier si une commande peut être retournée
orderSchema.methods.canBeReturned = function() {
  return this.status === 'delivered' && 
         !this.returnRequest &&
         (new Date() - new Date(this.updatedAt)) / (1000 * 60 * 60 * 24) <= 14 // 14 jours
}

// Méthode pour calculer le délai de livraison estimé
orderSchema.methods.calculateEstimatedDelivery = function() {
  const processingTime = 1 // 1 jour pour le traitement
  const shippingTime = 3 // 3 jours pour la livraison
  const date = new Date()
  date.setDate(date.getDate() + processingTime + shippingTime)
  return date
}

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order; 