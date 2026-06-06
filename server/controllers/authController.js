import User from '../models/User.js'
import {generateAccessToken,generateRefreshToken,setRefreshCookie} from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
    try{
        const {name, email, password } = req.body

        const userExists = await User.findOne({email})

        if(userExists) {
            return res.status(400).json({
                message: 'This email is already Registered',
            })
        }
        const user = await User.create({name, email, password})

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        setRefreshCookie(res, refreshToken)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
        })
    } catch(error){
        next(error)
    }
}

export const login = async (req, res, next) => {
    try{
        const {email, password} = req.body

        const user = await User.findOne({ email}).select('+password')

        if(!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                message: 'Invalid email or password..!'
            })
        }
        console.log(`Login: ${email} at ${new Date().toISOString()}`)

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        setRefreshCookie(res, refreshToken)

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try{
        const token = req.cookies.refreshToken

        if(token) {
            await User.findOneAndUpdate(
                {refreshToken: token},
                {refreshToken: ' '}
            )
        }
        res.clearCookie('refreshToken')
        res.json({message: 'Logout Successfully.!'})
    } catch(error) {
        next(error)
    }
}

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ message: 'Refresh token not Found' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    const user = await User.findById(decoded.id).select('+refreshToken')

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    setRefreshCookie(res, newRefreshToken)

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    next(error)
  }
}