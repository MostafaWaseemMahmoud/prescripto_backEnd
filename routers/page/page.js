const express = require("express");
const route = express.Router();
const pageSchema = require("../../models/page.model");

route.get("/page" , async (req,res)=> {
    const page = await pageSchema.find()
    return res.status(200).send(page[0])
})

route.post("updateabout:/newabout", async(req,res)=> {
    try {
        const page = await pageSchema.find()
        const {newabout} = req.params;
    page[0].about = newabout;
    await page.save()
    res.status(200).send(page[0].about);
    }catch(e) {
        return res.status(505).send("Error While Update Page About");
    }
}) 

route.post("updatephonenumber:/newphonenumber", async(req,res)=> {
    try {
        const page = await pageSchema.find()
        const {newphonenumber} = req.params;
        page[0].contactInfo.phoneNumber = newphonenumber;
    await page.save()
    res.status(200).send(page[0].phoneNumber);
    }catch(e) {
        return res.status(505).send("Error While Update Page Contact Info phoneNumber");
    }
})

route.post("updateemail:/newemail", async(req,res)=> {
    try {
        const page = await pageSchema.find()
        const {newemail} = req.params;
        page[0].contactInfo.email = newemail;
    await page.save()
    res.status(200).send(page[0].email);
    }catch(e) {
        return res.status(505).send("Error While Update Page Contact Info email");
    }
})

module.exports = route