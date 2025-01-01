const express = require("express");
const router = express.Router();
const DoctorSchema = require("../../models/doctor.model");
const PatientsSchema = require("../../models/patient.model");
const AdminSchema = require("../../models/admin.model");
const nodemailer = require("nodemailer")
// Get all doctors
router.get("/alldoctors", async (req, res) => {
    try {
        const allDocs = await DoctorSchema.find();
        return res.status(200).send(allDocs);
    } catch (e) {
        return res.status(500).send("Error while getting doctors: " + e.message);
    }
});

// Get all patients
router.get("/allpatients", async (req, res) => {
    try {
        const allPatients = await PatientsSchema.find();
        return res.status(200).send(allPatients);
    } catch (e) {
        return res.status(500).send("Error while getting patients: " + e.message);
    }
});

// Get all admins
router.get("/alladmin", async (req, res) => {
    try {
        const allAdmins = await AdminSchema.find();
        return res.status(200).send(allAdmins);
    } catch (e) {
        return res.status(500).send("Error while getting admins: " + e.message);
    }
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mostafawaseem22@gmail.com",  // Your Gmail address
    pass: "twap hqpb rbrj bcdp",  // Your Gmail app-specific password
  },
});

// Accept doctor
router.post('/acceptdoctor/:doctorid', async (req, res) => {
    const { doctorid } = req.params;
    try {
        const admin = await AdminSchema.findById("676ebbd74d557b9661d782e7");
        if (!admin) {
            return res.status(404).send("Admin not found");
        }

        const doctorIndex = admin.doctors.findIndex(doctor => doctor._id.toString() === doctorid);
        if (doctorIndex === -1) {
            return res.status(404).send("Doctor not found");
        }

        const doctor = admin.doctors[doctorIndex];
        admin.doctors.splice(doctorIndex, 1);
        await admin.save();

        const newDoctor = new DoctorSchema(doctor);
        await newDoctor.save();
        const mailOptions = {
            from: email,  // Your Gmail address
            to: "mostafawaseem88@gmail.com", // Recipient's email address
            subject: `${doctor.username} Has Accepted To Sart Work`,              // Subject of the email
            text: `
            HI My Name Is: ${doctor.username}, 
            ----------------------------------
            The Admin "Mostafa Waseem" Has Accepted You
            You To Start Work As A Doctor In Prescripto Web System
            ----------------------------------
            Please Go And Create A Doctor Account With The Same Data You Created
            ----------------------------------
            And Remind That We All Here Want The Patient Be Better
            `,
          };
        
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log('Error:', err);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        return res.status(200).send("Doctor accepted successfully");
    } catch (e) {
        return res.status(500).send("Error while accepting doctor: " + e.message);
    }
});

// Disagree doctor
router.post('/disagreedoctor/:doctorid', async (req, res) => {
    const { doctorid } = req.params;
    try {
        const admin = await AdminSchema.findById("676ebbd74d557b9661d782e7");
        if (!admin) {
            return res.status(404).send("Admin not found");
        }

        const doctorIndex = admin.doctors.findIndex(doctor => doctor._id.toString() === doctorid);
        if (doctorIndex === -1) {
            return res.status(404).send("Doctor not found");
        }
        const mailOptions = {
            from: email,  // Your Gmail address
            to: "mostafawaseem88@gmail.com", // Recipient's email address
            subject: `${admin.doctors[doctorIndex].username} Has Denied To Sart Work`,              // Subject of the email
            text: `
            HI My Name Is: ${admin.doctors[doctorIndex].username}, 
            ----------------------------------
            The Admin "Mostafa Waseem" Has Deneid You
            You To Start Work As A Doctor In Prescripto Web System
            ----------------------------------
            We Are So Sorry To You! Try Again Later
            ----------------------------------
            Or Call The Admin +20(1060432608)
            `,
          };
        
        admin.doctors.splice(doctorIndex, 1);
        await admin.save();
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log('Error:', err);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        return res.status(200).send("Doctor removed successfully");
    } catch (e) {
        return res.status(500).send("Error while removing doctor: " + e.message);
    }
});

// Change doctor status
router.post('/changedoctorstatus/:doctorid/:status', async (req, res) => {
    const { doctorid, status } = req.params;
    try {
        const doctor = await DoctorSchema.findById(doctorid);
        if (!doctor) {
            return res.status(404).send("Doctor not found");
        }

        doctor.Isonline = status === "true";
        await doctor.save();
        return res.status(200).send("Doctor status changed successfully");
    } catch (e) {
        return res.status(500).send("Error while changing doctor status: " + e.message);
    }
});

// Add appointment
router.post('/addappoiment/:doctorid/:appoimentid', async (req, res) => {
    const { doctorid, appoimentid } = req.params;
    try {
        const doctor = await DoctorSchema.findById(doctorid);
        const patient = await PatientsSchema.findById(appoimentid);

        if (!doctor || !patient) {
            return res.status(404).send("Doctor or Patient not found");
        }

        doctor.waitingappoiments.push(patient);
        await doctor.save();
        return res.status(201).send("Appointment sent successfully to the doctor");
    } catch (e) {
        return res.status(500).send("Error while adding appointment: " + e.message);
    }
});

// Accept appointment
router.post("/acceptappoiment/:doctorid/:appoimentid", async (req, res) => {
    const { doctorid, appoimentid } = req.params;
    try {
        const doctor = await DoctorSchema.findById(doctorid);
        if (!doctor) {
            return res.status(404).send("Doctor not found");
        }

        const patientIndex = doctor.waitingappoiments.findIndex(patient => patient._id.toString() === appoimentid);
        if (patientIndex === -1) {
            return res.status(404).send("Appointment not found");
        }

        const patient = doctor.waitingappoiments[patientIndex];
        doctor.waitingappoiments.splice(patientIndex, 1);
        doctor.appoiments.push(patient);
        await doctor.save();

        return res.status(201).send("Appointment accepted by the doctor");
    } catch (e) {
        return res.status(500).send("Error while accepting appointment: " + e.message);
    }
});

// Deny appointment
router.post("/denyappoiment/:doctorid/:appoimentid", async (req, res) => {
    const { doctorid, appoimentid } = req.params;
    try {
        const doctor = await DoctorSchema.findById(doctorid);
        if (!doctor) {
            return res.status(404).send("Doctor not found");
        }

        const patientIndex = doctor.waitingappoiments.findIndex(patient => patient._id.toString() === appoimentid);
        if (patientIndex === -1) {
            return res.status(404).send("Appointment not found");
        }

        doctor.waitingappoiments.splice(patientIndex, 1);
        await doctor.save();
        return res.status(201).send("Appointment denied by the doctor");
    } catch (e) {
        return res.status(500).send("Error while denying appointment: " + e.message);
    }
});

// Mark patient as done

router.get("/admin", async (req, res) => {
    try {
        const admin = await AdminSchema.find();
        if (!admin) {
            return res.status(404).send("Admin not found");
        }
            res.status(200).send(admin);
    } catch (e) {
        return res.status(500).send("Error while getingadmin as done: " + e.message);
    }
});
module.exports = router;
