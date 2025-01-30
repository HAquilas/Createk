import mongoose from 'mongoose'

const openingHoursSchema = new mongoose.Schema({
  open: {
    type: String,
    default: '09:00'
  },
  close: {
    type: String,
    default: '18:00'
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, { _id: false })

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Le nom de la boutique est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    default: 'Description de ma boutique',
    trim: true
  },
  logo: {
    type: String,
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  categories: [{
    type: String,
    trim: true
  }],
  openingHours: {
    monday: { type: openingHoursSchema, default: () => ({ open: '09:00', close: '18:00', isOpen: true }) },
    tuesday: { type: openingHoursSchema, default: () => ({ open: '09:00', close: '18:00', isOpen: true }) },
    wednesday: { type: openingHoursSchema, default: () => ({ open: '09:00', close: '18:00', isOpen: true }) },
    thursday: { type: openingHoursSchema, default: () => ({ open: '09:00', close: '18:00', isOpen: true }) },
    friday: { type: openingHoursSchema, default: () => ({ open: '09:00', close: '18:00', isOpen: true }) },
    saturday: { type: openingHoursSchema, default: () => ({ open: '09:00', close: '18:00', isOpen: true }) },
    sunday: { type: openingHoursSchema, default: () => ({ open: '09:00', close: '18:00', isOpen: false }) }
  },
  address: {
    street: {
      type: String,
      default: 'À définir'
    },
    city: {
      type: String,
      default: 'À définir'
    },
    state: {
      type: String,
      default: 'À définir'
    },
    country: {
      type: String,
      default: 'Bénin'
    },
    postalCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    email: {
      type: String,
      required: [true, 'L\'email de contact est requis']
    },
    phone: {
      type: String,
      default: 'À définir'
    },
    whatsapp: String,
    facebook: String,
    instagram: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  metrics: {
    totalProducts: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  settings: {
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 0
    },
    acceptsReturns: {
      type: Boolean,
      default: true
    },
    returnPeriod: {
      type: Number,
      default: 7
    }
  }
}, {
  timestamps: true
})

// Index pour la recherche
shopSchema.index({
  name: 'text',
  description: 'text',
  'address.city': 'text'
})

// Méthodes virtuelles
shopSchema.virtual('isOpen').get(function() {
  const now = new Date()
  const day = now.toLocaleLowerCase().slice(0, 3)
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  
  const todayHours = this.openingHours[day]
  if (!todayHours || !todayHours.isOpen) return false
  
  return time >= todayHours.open && time <= todayHours.close
})

export default mongoose.models.Shop || mongoose.model('Shop', shopSchema) 