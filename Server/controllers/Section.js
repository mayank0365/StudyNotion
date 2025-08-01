const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection =require("../models/SubSection");
//create a section
exports.createSection=async(req,res)=>{
    try{
        //data fetch

        const {sectionName,courseId}=req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            });
        }
        //create section
         const newSection=await Section.create({sectionName,courseId});
        //update course with section ObjectID

         const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                     courseId,
                                                     {
                                                        $push:{
                                                            courseContent:newSection._id,
                                                        }
                                                     }   ,
                                                     {new:true},    
         )
           .populate({
              path:"courseContent",
              populate:{
                path:"subSection",
              },
         })
         .exec();
         //hw use populate to replace sections/subsection both in the updatedcoursedetails
       
        //return response

        return res.status(200).json({
            success:true,
            message:'section created successfully',
             updatedCourseDetails,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to create section , please try again",
            error:error.message,
        })

    }
};


//update a section

exports.updateSection=async(req,res)=>{
    try{
         //data fetch
         const {sectionName,sectionId,courseId}=req.body;

         //data validation
                 if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            });
        }
         //update data
         const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
         const course=await Course.findById(courseId)
         .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },

         }).exec();
         //return res

         return res.status(200).json({
            success:true,
            message:'section updated successfully',
            data:course,
         });
    }
    catch(error){
         return res.status(500).json({
            success:false,
            message:"unable to update section , please try again",
            error:error.message,
        })

    }
};

//delete a section

exports.deleteSection=async(req,res)=>{
    try{
        //getid-assuming that we are sending id in params
//         console.log("✅ deleteSection route hit");
// console.log("📦 Request Body:", req.body);


        const {sectionId,courseId}=req.body;
        // console.log("sectionid",sectionId);
        // console.log("courseId",courseId);
        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent:sectionId,
            }
        })

        //use fins byidanddelete
        const section= await Section.findById(sectionId);

        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found",
            })
        }

        await SubSection.deleteMany({_id: {$in: section.subSection}});

        await Section.findByIdAndDelete(sectionId);

        const course=await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec();

        //todo do we need to delete from course schema
        //return response
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            data:course
        });
        
    }
    catch(error){
         return res.status(500).json({
            success:false,
            message:"unable to delete section , please try again",
            error:error.message,
        })
    }
}

