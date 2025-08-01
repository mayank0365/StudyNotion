const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const {mongo, default: mongoose}= require("mongoose");


//createRating
exports.createRating=async(req,res)=>{
    try{
          //get user id

          const userId=req.user.id;
           
          //fetch data from  req body

          const {rating,review,courseId}=req.body;
          //check if user is enrolled or not
          const courseDetails=await Course.findOne(
                                                    {_id:courseId,
                                                         studentsEnrolled:{$elemMatch: {$eq: userId}},


                                                    },
                                                                     
          );

          if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'students is not enrolled in the course',
            });
          }
          //check if user already revie the course
          const alreadyReviewed=await RatingAndReview.findOne({
                                                             user:userId,
                                                                course:courseId, 
          })   ;

          if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:'course is already reviewed by the user',
            });
          }
          
          //creare rating and review
          const ratingReview=await RatingAndReview.create({
                                                          rating,review,
                                                          course:courseId,
                                                          user:userId,

          });
          //update course with this rating/review
          const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
                                           $push:{
                                            ratingandReviews:ratingReview._id,
                                           }
          },
        {new:true});
        console.log(updatedCourseDetails);
          //return response

          return res.status(200).json({
            success:true,
            message:"Rating adn Review created Successfully",
            ratingReview,
          })

    }
    catch(error){
       console.log(error);

       return res.status(500).json({
        success:false,
        message:error.message,
       });
    }
}
 



//getaveragerating
exports.getAverageRating=async(req,res)=>{
    try{
        //get an course id

        const courseId=req.body.couresId;
        //calculating avg rating
       
        const result=await RatingAndReview.aggregate([
          {
            $match:{
              course:new mongoose.Types.ObjectId(courseId),
            },
          },
          {
            $group:{
                 _id:null,
                 averageRating:{ $avg : "$rating"},
            }
          }
        ])



        //return rating
        if(result.length>0){
          return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating,
          })
        }//if no rating exist
        return res.status(200).json({
          success:true,
          message:"average rating us 0, no ratings given till now ",
          averageRating:0,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getallrating

exports.getAllRating=async(req,res)=>{
  try{
       const allReviews=await RatingAndReview.find({})
                                              .sort({rating: "desc"})
                                              .populate({
                                                   path:"user",
                                                   select:"firstName lastName email image"
                                              })
                                              .populate({
                                                path:"course",
                                                select:"courseName",
                                              })
                                              .exec();
         return res.status(200).json({
          success:true,
          message:"all views fetched successfully",
          data:allReviews,
         });
  }
  catch(error){
    console.log(error);

    return res.status(500).json({
      success:false,
      message:error.message,
    })
  }
}
