import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  orderUpdates: {
    type: Boolean,
    default: true
  },
  marketingEmails: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    enum: ['fr', 'en'],
    default: 'fr'
  },
  currency: {
    type: String,
    enum: ['XOF', 'EUR', 'USD'],
    default: 'XOF'
  },
  timezone: {
    type: String,
    enum: ['Africa/Porto-Novo', 'Europe/Paris'],
    default: 'Africa/Porto-Novo'
  }
}, {
  timestamps: true
})

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema) 