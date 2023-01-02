import express from "express";

import { getHospital, getHospitalById, registerHospitals } from "../Controllers/hospitalControllers";

const router = express.Router();

router.route('/hospital')
    .post(registerHospitals)
    .get(getHospital)
    .get(getHospital);

router.route('/hospital/:id')
    .get(getHospitalById);

export default router;