import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE}
    )
}

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {id: userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRE}
    )
}

export const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 100,
    })
}