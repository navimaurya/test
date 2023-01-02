import mongoose, { Types } from "mongoose";
import crypto from 'crypto';
import bcrypt from 'bcryptjs'
import validator from 'validator';


const patientsSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 40,
    require: [true, "Patient's name is require"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    require: [true, "Patient's email id is require"],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  doctor: {
    type: Types.ObjectId,
    ref: "Doctors",
    default: null
  },
  hospital: {
    type: Types.ObjectId,
    ref: "Hostpial",
    default: null
  },
  address: {
    type: String,
    require: [true, "Please provide address"],
    validate: {
      validator: function (v: String) {
        return v.length > 9
      },
      message: 'Provide a valid address'
    },
  },
  countryCode: {
    type: Number,
    require: [true, "Country code is missing"],
    validate: {
      validator: function (v: Number) {
        if (!Number.isInteger(v)) return false;
        if ((v).toString().length < 1 || (v).toString().length > 3) return false;
        return true;
      },
      message: 'Please provide valid phone code'
    }
  },
  phone: {
    type: Number,
    unique: true,
    require: [true, "Please provide a valid phone number"],
    validate: {
      validator: function (v: Number) {
        if (!Number.isInteger(v)) return false;
        if ((v).toString().length != 10) return false;
        return true;
      },
      message: 'Please provide valid phone number'
    }
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el: String) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
    select: false,
  }
}, { versionKey: false })
patientsSchema.index({ email: 1, phone: 1 }, { unique: true });

patientsSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

patientsSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


export default mongoose.model('Patients', patientsSchema) 