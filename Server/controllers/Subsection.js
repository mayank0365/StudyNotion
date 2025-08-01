const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadImageToCloudinary}=require("../utils/imageUploader");

//create Subsection

exports.createSubSection=async(req,res)=>{
    try{
        //fetch data from body

        const {sectionId,title,description}=req.body;
        //extract file/video
        const video=req.files.video;
        //validation
        if(!sectionId ||!title  || !description || !video){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        console.log(video);
        //upload video to cloudinary

        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        //create a subsection

        const SubSectionDetails=await SubSection.create({
            title:title,
          //  timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update section with this subsection object id

        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
                                                             {$push:{
                                                                subSection:SubSectionDetails._id,
                                                             }},
                                                             {new:true}

        ).populate("subSection")
        //hw:log updated section here , after adding populate query

        console.log("subsection created and section updated");

        //return response
           return res.status(200).json({
            success:true,
            message:'subsection created sucessully',
            data: updatedSection,
           })

    }
    catch(error){
      console.error("error:",error.message);
        return res.status(500).json({
            success:false,
            message:'internal server error',
            error:error.message,
        });

    }
};

//hw :updatesubsection

exports.updateSubSection=async(req,res)=>{
    try{

        const {sectionId,subSectionId,title,description}=req.body
        const subSection=await SubSection.findById(subSectionId)

        //validation

        if(!subSection){
            return res.status(400).json({
                success:false,
                message:"SubSection not found",
            })
        }

        if(title !== undefined){
            subSection.title=title
        }
        if(description!==undefined){
            subSection.description=description
        }

        if(req.files && req.files.video!==undefined){
            const video = req.files.video
            const uploadDetails=await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl=uploadDetails.secure_url
            subSection.timeDuration=`${uploadDetails.duration}`

        }

        await subSection.save()
        const updatedSection=await SectionfindById(sectionId).populate("subSection")
        return res.json({
            success:true,
            data:updatedSection,
            message:"Section updated Successfully",
        })
        

    }
    catch(error){

        console.log(error)
        return res.status(500).json({
            success:false,
            message:"an error occured while updating the section",
        })

    }
}
//hw:delete subsection


  exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection=await SectionfindById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }