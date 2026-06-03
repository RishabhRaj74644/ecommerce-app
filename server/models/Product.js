import mongoose from "mongoose";
import Category from "./Category.js";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Need Product name'],
            trim: true,
        },
        price: {
            type: String,
            required: [true, 'Need price'],
            min: [0, 'price cant be -ve'],
        },
        description: {
            type: String,
            required: [true, 'Need description'],
        },

        images: [{type: String}],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        stock:{
            type: Number,
            required: true,
            default: 0,
            min: [0, 'stock cant be -ve'],
        },
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

productSchema.index({name: 'text', description: 'text'});

export default mongoose.model('Product', productSchema);