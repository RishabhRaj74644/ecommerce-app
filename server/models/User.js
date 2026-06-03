import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:[true, 'Mandatory name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Mandatory email'],
            unique: [true, 'verify.! again not unique'],
            lowecase: [true, 'Must be in Lowercase'],
            match: [/^\S+@\S+\.\S+$/, 'Fill valid email' ],
        },
        password: {
            type: String,
            required: [true, 'Password mandatory'],
            minlength: [6, 'Password must be minlength of 6 character'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        refreshToken: {
            type: String,
            select: false,
        },        
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', async function (){
    if(!this.isModified('password')){
        return 
    }
    this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema)