import { Request } from 'express';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import User, { IUser } from "../model/userModel";

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protect = asyncHandler(async (req, res, next) => {
  let token: any;

  //Read JWT from cookie
  token = req.headers.authorization
  
  if (token == null) {
    return res.status(403)
  }

  const jwtSecret: Secret | undefined = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).send('Internal Server Error: JWT_SECRET is not defined');
    return;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret) as DecodedToken
      // @ts-ignore:next-line
      req.user = await User.findById(decoded.userId).select('-password')
      return next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  } else {
    res.status(401)
    throw new Error('Not authorized, no token available')
  }
})

export const admin = (req: any, res: any, next: any) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as admin')
  }
}