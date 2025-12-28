const planner =require("../models/planner");

const saveplanner=async(req,res)=>{
    const{day,activity,fromtime,totime}=req.body;
 if(!day || !activity || !fromtime || !totime)
 {
    return res.status(400).json({
        success:false,
        message:"All fields are required"
    })
 }
 await planner.deleteMany({day});

 await planner.create({
    day,
    activity,
    fromtime,
    totime
 });
 res.json({
    success:true,
    message:"Planner saved successfully"
 });
}

const getplanner=async(req,res)=>{
    const data=await planner.find();
    res.json({
        success:true,
        data
    })
};

module.exports={saveplanner,getplanner};