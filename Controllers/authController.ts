import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import Patients from "../models/Patients.model";


type User = InstanceType<typeof Patients>

const signToken = (id: any) => {
  return jwt.sign({ id }, "hjhhG4F4ereFFEF548EFDSw53rf@RF4FEFe484sefGD6", {
    expiresIn: '90d',
  });
};

export const createSendToken = (user: User, statusCode: number, req: Request, res: Response) => {
  const token = signToken(user._id);
  // JWT_COOKIE_EXP
  const cookieOptons = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
    // secure: req.secure || req.headers('x-forwarded-proto') === 'https',
  };
  res.cookie('jwt', token, cookieOptons);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data:
      user,
  });
};