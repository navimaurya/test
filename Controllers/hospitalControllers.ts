import express, { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Hospitals from "../models/Hospitals.model";
import Doctors from "../models/Doctors.model";
import Patients from "../models/Patients.model";

export const registerHospitals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, details } = req.body
    const hospital = await Hospitals.create({
        name, email, details
    })
    res.status(200).json({
        status: 'success',
        data: hospital
    })
});

export const getHospital = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = +req.query.page || 1;
    const skip = (page - 1) * 10;

    // const hospital = await Hospitals.find().skip(skip).limit(10)
    const count = await Hospitals.count({})

    const hospital = await Hospitals.aggregate([
        { $skip: skip },
        { $limit: 10 },
        {
            $lookup: {
                from: "doctors",
                localField: "_id",
                foreignField: "hospital",
                as: "doctors"
            }
        },
        {
            $lookup: {
                from: "patients",
                localField: "doctors._id",
                foreignField: "doctor",
                as: "patients"
            }
        },
        {
            $project: {
                _id: '$_id',
                name: "$name",
                details: '$details',
                doctorCount: { $size: "$doctors" },
                patientsCount: { $size: "$patients" },
                // doctors: "$doctors",
            }
        }
    ])

    res.status(201).json({
        status: 'success',
        currentPage: page,
        totalPages: Math.ceil(count / 10),
        result: hospital.length,
        data: hospital
    })
});

export const getHospitalById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params
    if (!id) return next(new AppError("Provide a valid hospital id", 400))

    const hospital = (await Hospitals.findById(id))?.toObject();

    if (!hospital) return next(new AppError('Hopital not found', 404))

    const totalDoctors = await Doctors.count({ hospital: id });
    const totalPatients = await Patients.count({ hospital: id });
    const doctors = await Doctors.aggregate([
        { $match: { hospital: new Types.ObjectId(id) } },
        {
            $lookup:
            {
                from: 'patients',
                localField: '_id',
                foreignField: 'doctor',
                as: 'patients',
            }
        },
        {
            $addFields: {
                totalPatients: { $size: "$patients" }
            }
        },
        { $project: { patients: 0, hospital: 0 } }
    ])

    // const hospital = await Hospitals.aggregate([
    //     {
    //         $match: {
    //             _id: new Types.ObjectId(id)
    //         }
    //     },
    //     {
    //         $lookup:
    //         {
    //             from: 'doctors',
    //             localField: '_id',
    //             foreignField: 'hospital',
    //             as: 'doctors'
    //         }
    //     }
    // ])

    res.status(200).json({
        status: 'success',
        data: {
            ...hospital,
            totalDoctors,
            totalPatients,
            doctors
        }
    })
});
