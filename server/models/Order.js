import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity:{
        type: Number,
    },
    image: {
        type: String,
    },
})

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        orderItems: [orderItemSchema],

        shippingAddress: {
            address: {type: String, required: true},
            city: {type: String, required: true},
            pincode: {type: String, required: true},
            state: {type: String, required: true},
        },
        paymentMethod: {
            type: String,
            enum: ['Razorpay', 'COD'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'fialed'],
            default: 'pending',
        },   
        paymentResult: {
            razorpay_order_id: {type: String},
            razorpay_payment_id: { type: String },
            razorpay_signature: { type: String },
        },
        orderStatus: {
            type: String,
            enum: ['processing', 'shipped', 'delivered', 'cancelled'],
            default: 'processing',
        },
        itemsPrice: {
            type: Number,
            required: true,            
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        paidAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Order', orderSchema)