import mongoose, { Types } from "mongoose";
import validator from 'validator';


const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Hospital's name is require"]
  },
  email: {
    type: String,
    lowercase: true,
    require: [true, "Doctor's email id is require"],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  details: {
    type: String,
    default: null
  }
}, { versionKey: false })
doctorSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('Hospitals', doctorSchema) 