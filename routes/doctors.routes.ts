import express from "express";

import { getDoctor, registerDoctor } from "../Controllers/doctorsControllers";

const router = express.Router();

router.route('/doctor')
    .post(registerDoctor)
    .get(getDoctor);

export default router;