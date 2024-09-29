import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Sign the JWT
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Cannot be accessed via client-side JavaScript
    secure: process.env.NODE_ENV !== 'development', // Secure in production (over HTTPS)
    sameSite: 'strict', // Prevents CSRF by restricting cross-site requests
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
};

export default generateToken;
