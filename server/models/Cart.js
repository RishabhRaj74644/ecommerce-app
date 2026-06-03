import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: 'true',
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity cant less than 1']
    },
})

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    items: [cartItemSchema],

    totalAmount: {
        type: Number,
        default: 0,
    },
},
{
    timestamps: true,
}
)

cartSchema.pre('save', function(next){
    this.totalAmount = this.items.reduce(
        (sum, item) => sum + item.price * item.quantity,0
    )
})

export default mongoose.model('Cart', cartSchema)