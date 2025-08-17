const {Mongoose}=require("mongoose");
const Category=require("../models/Category");
//create tag ka handler function

function getRandomInt(max){
    return Math.floor(Math.random()*max)
}



exports.createCategory=async(req,res)=>{
    try{
         //fetch data
        const {name,description}=req.body;
        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:'all fields are required',
            });
        }

        //create entry in db
        const CategoryDetails=await Category.create({
            name:name,
            description:description,
        });
        console.log(CategoryDetails);
        //return response

        return res.status(200).json({
            success:true,
            message:'categorys created successfully',
            data:CategoryDetails,

        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
};

//get all tags handler function

exports.showAllCategories=async(req,res)=>{
    try{
        const allCategorys=await Category.find({},{name:true,description:true} )
        .populate("courses")
        .exec();
        res.status(200).json({
            success:true,
            message:"all tags returned successfully",
            data: allCategorys,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
};

//categoryPageDetails

exports.categoryPageDetails=async(req,res)=>{
    try{
          //getcategory id

          const {categoryId}=req.body;
          console.log("categoryid",categoryId);
          //get courses for specified categoryi if
  
          const selectedCategory=await Category.findById(categoryId)
                                                               .populate({
                                                                path:"courses",
                                                                match:{ status: "Published"},
                                                                populate:[
                                                                    {path:"instructor" , select: "firstName lastName image" },
                                                                    {path:"ratingAndReviews"}
                                                                ] 
                                                               })
                                                               .exec();

console.log("Selected Category:", JSON.stringify(selectedCategory, null, 2));

          //validation
          if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:'catgory not found',
            });
          }

             // Handle the case when there are no courses
                if (selectedCategory.courses.length === 0) {
                  console.log("No courses found for the selected category.")
                  return res.status(404).json({
                    success: false,
                    message: "No courses found for the selected category.",
                  })
                }
            
                // Get courses for other categories
                const categoriesExceptSelected = await Category.find({
                  _id: { $ne: categoryId },
                })
           
          //get courses for different categories
            let differentCategories=await Category.findOne(
                categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
                                                     
            )
            .populate({
                path: "courses",
                match: { status: "Published"},
                populate:{path:"instructor", select: "firstName lastName image" }

            })
            .exec()
            console.log("Different Categories:", JSON.stringify(differentCategories, null, 2));
           //console.log("Most Selling Courses:", JSON.stringify(mostSellingCourses, null, 2));

          //get top selling courses
              const allCategories = await Category.find()
                   .populate({
                     path: "courses",
                     match: { status: "Published" },
                     populate: {
                       path: "instructor",
                   },
                   })
                   .exec()
                 const allCourses = allCategories.flatMap((category) => category.courses)
                 const mostSellingCourses = allCourses
                   .sort((a, b) => b.sold - a.sold)
                   .slice(0, 10)
          //hw todo 
          //return response

          return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
                mostSellingCourses,
            },
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