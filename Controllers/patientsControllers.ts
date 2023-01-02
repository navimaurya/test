import express, { Request, Response, NextFunction } from "express";
import multer from 'multer';
import sharp from "sharp";

import Patients from "../models/Patients.model";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { createSendToken } from "./authController";

// Setting
const multerStorage = multer.memoryStorage();

// RESIXONG IMAGE
export const resizeUserImage = async (req: Request) => {
    if (!req.file) return 'default.jpeg';

    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 50 })
        .toFile(`public/img/users/${req.file.filename}`);
    return req.file.filename;
};

const multerFilter = (req: Request, file: any, cb: Function) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! please upload only images.', 400), false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});
export const uploadUserPhoto = upload.single('photo');


export const registerPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, email, countryCode, hospital, phone, doctor, password, passwordConfirm } = req.body

    const newPatient = await Patients.create({
        name, address, email, countryCode, phone, hospital, doctor, password, passwordConfirm
    })
    req.user = newPatient;
    await resizeUserImage(req)
    newPatient.photo = req.file.filename
    await newPatient.save({ validateBeforeSave: false })
    createSendToken(newPatient, 201, req, res);
});

export const getPatients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = +req.query.page || 1;
    const skip = (page - 1) * 10;
    const patients = await Patients.find().skip(skip).limit(10)
    const count = await Patients.count({})

    res.status(200).json({
        status: 'success',
        currentPage: page,
        totalPages: Math.ceil(count / 10),
        result: patients.length,
        data: patients
    })
});
