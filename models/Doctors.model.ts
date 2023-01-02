import mongoose, { Types } from "mongoose";
import validator from 'validator';


const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Doctor's name is require"]
  },
  email: {
    type: String,
    lowercase: true,
    require: [true, "Doctor's email id is require"],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  hospital: {
    type: Types.ObjectId,
    ref: 'Hospitals',
    require: [true, 'A doctor should be in a hospital']
  }
}, { versionKey: false })
doctorSchema.index({ email: 1, hospital: 1 }, { unique: true });

export default mongoose.model('Doctors', doctorSchema) 