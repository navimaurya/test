import express from "express";

import { getPatients, registerPatient, uploadUserPhoto } from "../Controllers/patientsControllers";

const router = express.Router();

router.route('/patient')
    .post(uploadUserPhoto, registerPatient)
    .get(getPatients);

export default router;