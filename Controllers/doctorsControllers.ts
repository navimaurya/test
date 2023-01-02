import express, { Request, Response, NextFunction } from "express";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Doctors from "../models/Doctors.model";

export const registerDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, hospital } = req.body
    const doctor = await Doctors.create({
        name, email, hospital
    })
    res.status(201).json({
        status: 'success',
        data: doctor
    })
});

export const getDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = +req.query.page || 1;
    const skip = (page - 1) * 10;
    const doctor = await Doctors.find().skip(skip).limit(10).populate('hospital')
    const count = await Doctors.count({})

    res.status(200).json({
        status: 'success',
        currentPage: page,
        totalPages: Math.ceil(count / 10),
        result: doctor.length,
        data: doctor
    })
});
