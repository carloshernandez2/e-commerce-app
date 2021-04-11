const Mongoose = require('mongoose')

const reviewSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true }
  },
  {
    timestamps: true
  }
)

module.exports = reviewSchema
