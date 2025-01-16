const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const PatientSchema = require("../../models/patient.model");
const DoctorSchema = require("../../models/doctor.model");
const AdminSchema = require("../../models/admin.model");
const nodemailer = require('nodemailer');

require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Node Mailer 
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mostafawaseem22@gmail.com",  // Your Gmail address
    pass: "twap hqpb rbrj bcdp",  // Your Gmail app-specific password
  },
});


// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`, // Generate a unique public ID
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

router.post('/patient', upload.single('profilePic'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
  
    try {
      const { username, email, illness, phonenumber, password } = req.body;
      const profilePicUrl = req.file ? req.file.path : 'https://example.com/default-profile-pic.jpg';
      
      if (!username || !email || !illness || !phonenumber || !password || !profilePicUrl) {
        return res.status(400).send("Missing required fields");
      }
  
      const patient = new PatientSchema({
        username,
        email,
        illness,
        phonenumber,
        password,
        profilepic: profilePicUrl,
      });
  
      await patient.save();
      res.status(200).send(patient);
    } catch (e) {
      console.error("Error while adding patient:", e);
      res.status(500).send("Error while adding patient: " + e.message);
    }
  });

router.post('/doctor', upload.single('profilePic'), async (req, res) => {
    try {
      // Destructure data from the request body
      const { username, email, job, phonenumber, password, age,appoimentprise,about,locatoin } = req.body;
      
      // Check if a file was uploaded
      const profilePic = req.file ? req.file.path : 'https://example.com/default-profile-pic.jpg';
      
      // Validate if all fields are present
      if (!username || !email || !job || !phonenumber || !password || !age || !profilePic || !appoimentprise || !about || !locatoin) {
        return res.status(400).send("Missing required fields: username, email, job, phonenumber, password, age, profilePic, locatoin");
      }
  
      // Create a new Doctor object and save it to the database
      const doctor = new DoctorSchema({
        username,
        email,
        job,
        phonenumber,
        password,
        age,
        profilepic: profilePic,
        appoiments: [],
        Isonline: false,
        appoimentPrise: appoimentprise,
        about: about,
        location: locatoin,
      });
  
      const theAdmin = await AdminSchema.findById("676ebbd74d557b9661d782e7");
      console.log(theAdmin);
      console.log(theAdmin.doctors);
      theAdmin.doctors.push(doctor)
      console.log(theAdmin.doctors);
      await theAdmin.save()
      const mailOptions = {
        from: email,  // Your Gmail address
        to: "mostafawaseem88@gmail.com", // Recipient's email address
        subject: "Doctor Job Needed From Priscripto System",              // Subject of the email
        text: `
        HI My Name Is: ${doctor.username}, 
        ----------------------------------
        and My Old As A Doctor: ${doctor.age}, 
        ----------------------------------
        and My Job Is: ${doctor.job}, 
        ----------------------------------
        and My email Is: ${doctor.email},
        ----------------------------------
        and My phonenumber Is: ${doctor.phonenumber},
        ----------------------------------
        and Live In: ${doctor.location},
        ----------------------------------
        And I Well Be So Happy To Join Your Priscripto System 
        `,
      };
    
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log('Error:', err);
        } else {
          console.log('Email sent:', info.response);
        }
      });
      res.status(201).send("Doctor Send Succ To The Admin");  // Send back the created doctor as the response
    } catch (error) {
      console.error("Error while adding doctor:", error);
      res.status(500).send("Error while adding the doctor.");
    }
});

router.post('/admin', upload.single('profilePic'), async (req, res) => {
    try {
      // Destructure data from the request body
      const { username, email, password } = req.body;
      
      // Check if a file was uploaded
      const profilePicUrl = req.file ? req.file.path : 'https://example.com/default-profile-pic.jpg';
      
      // Validate if all fields are present
      if (!username || !email || !password || !profilePicUrl) {
        return res.status(400).send("Missing required fields: username, email, password, profilePic");
      }
  
      // Create a new Doctor object and save it to the database
      const admin = new AdminSchema({
        username,
        email,
        password,
        profilepic: profilePicUrl,
        doctors: [],
      });
  
      await admin.save();
      res.status(201).send(admin);  // Send back the created doctor as the response
    } catch (error) {
      console.error("Error while adding admin:", error);
      res.status(500).send("Error while adding the admin.");
    }
});


  
  
module.exports = router;
