import jwt, { Secret } from 'jsonwebtoken'
import { Response } from 'express'

const generateToken = (res: Response, userId: string) => {
  const jwtSecret: Secret | undefined = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).send('Internal Server Error: JWT_SECRET is not defined');
    return;
  }

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: '30d'
  })

  res.setHeader('Access-Control-Allow-Credentials', 'true')

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  return token
}

export default generateToken