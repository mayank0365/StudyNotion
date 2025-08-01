import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import RequirementField from './RequirementField';
import {setStep,setCourse} from '../../../../../slices/courseSlice';
import IconBtn from '../../../../common/IconBtn';
import {toast} from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';
import Upload from '../Upload';

const CourseInformationForm = () => {
   
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
        }=useForm();

    const dispatch=useDispatch();
    const {token}=useSelector((state)=>state.auth);
    const {course,editCourse,step}=useSelector( (state)=>state.course);
    const [loading,setLoading]=useState(false);
    const [courseCategories,setCourseCategories]=useState([]);


    console.log("courseInformation step is ",step);

    useEffect(()=>{
        const getCategories=async()=>{
            setLoading(true);
            const categories =await fetchCourseCategories();
            if(categories.length>0){
                setCourseCategories(categories);
            }
            setLoading(false);
        }

        if(editCourse){
            setValue("courseTitle",course.courseName);
            setValue("courseShortDesc",course.courseDescription);
            setValue("coursePrice",course.price);
            setValue("courseTags",course.tag);
            setValue("courseBenefits",course.whatYouWillLearn);
            setValue("courseCategory",course.category);
            setValue("courseRequirements",course.instructions);
            setValue("courseImage",course.thumbnail);
        }
        getCategories();
    },[])
//console.log("course ki catefory ye le dekh ",courseCategories);

    const isFormUpdated=()=>{
        const currentValues=getValues();
        if(currentValues.courseTitle !==course.courseName ||
           currentValues.courseShortDesc !==course.courseDescription ||
           currentValues.coursePrice !==course.price ||
           currentValues.courseTitle !==course.courseName ||
          // currentValues.courseTags.toString() !==course.tag.toString() ||
           currentValues.courseBenefits !==course.whatYouWillLearn||
           currentValues.courseCategory._id !==course.category._id ||
          // currentValues.courseImage !==course.thumbnail||
           currentValues.courseRequirements.toString() !==course.instructions.toString() 
        )
            return true;
        else
            return false;
    }
    const onSubmit=async(data)=>{
        

        if(editCourse){
           if(isFormUpdated()){
               const currentValues=getValues();
            const formData=new FormData();

            formData.append("courseId",course._id);


            if(currentValues.courseTitle!==course.courseName){
                formData.append("courseName",data.courseTitle);

            }
                 if(currentValues.courseShortDesc!==course.courseDescription){
                formData.append("courseDescription",data.courseShortDesc);

            }

                 if(currentValues.coursePrice
                    !==course.price){
                formData.append("price",data.coursePrice);

            }

                 if(currentValues.courseBenefits!==course.whatYouWillLearn){
                formData.append("whatYouWillLearn",data.courseBenefits);

            }

                 if(currentValues.courseCategory._id!==course.category._id){
                formData.append("category",data.courseCategory);

            }

                 if(currentValues.courseRequirements.toString() !== course.instruction.toString){
                formData.append("instruction",JSON.stringify(data.courseRequirements));

            }

               if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

            setLoading(true);
            const result=await editCourseDetails(formData,token);
            setLoading(false);

            if(result){
                ////setStep(2);
                dispatch(setStep(2));
                dispatch(setCourse(result));
            }


           }

           else{
            toast.error("NO changes made to form")
           }

           return;



        }
        //create a new course
        const formData=new FormData();
        formData.append("courseName",data.courseTitle);
         formData.append("courseDescription",data.courseShortDesc);
          formData.append("price",data.coursePrice);
           formData.append("whatYouWillLearn",data.courseBenefits);
            formData.append("category",data.courseCategory);
             formData.append("instructions",JSON.stringify(data.courseRequirements));

                 formData.append("thumbnailImage", data.courseImage)

                formData.append("status",COURSE_STATUS.DRAFT);

                setLoading(true);
                const result=await addCourseDetails(formData,token);

                if(result){
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
                setLoading(false);



       
    }



 console.log("coursecategories",courseCategories);


  return (
     <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
     
     >

        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor='courseTitle'>Course Title<sup className="text-pink-200">*</sup></label>
            <input
            
            id='courseTitle'

            placeholder='Enter Course Title'
            {...register("courseTitle",{required:true})}
            className=' form-style w-full'
            />

            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required**</span>
                )
            }
        </div>

        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor='courseShortDesc'>Course Short Description<sup className="text-pink-200">*</sup></label>
            <textarea
            id='courseShortDesc'
            placeholder='enter description'
            {...register("courseShortDesc",{required:true})}
            className="form-style resize-x-none min-h-[130px] w-full"
            />

            {
                errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Description is required</span>
                )
            }
        </div>


               <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup></label>
            <input
            id='coursePrice'
            placeholder='enter Course Price'
            {...register("coursePrice",{
                required:true,
                valueAsNumber:true,
            
            })}
            className='form-style w-full'
            />
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />

            {
                errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is Required *</span>
                )
            }
        </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup></label>

            <select
            id='courseCategory'
               className="form-style w-full"

            defaultValue=""
            {...register("courseCategory",{required:true})}
            >

                <option value="" disabled>Choose a category</option>

                {
                    !loading && courseCategories.map((category,index)=>(
                        <option key={index} value={category?._id} >
                            {category?.name}
                        </option>
                    ))
                }

            </select>
            {errors.courseCategory && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Course Category is Required
                </span>
            )}
        
        </div>

        {/* {create a custom component for handling tags input} */}
         {/* <ChipInput
         label="tags"
         name="courseTags"
         placeholder="Enter tags and press enter"
         register={register}
         errors={errors}
         setValue={setvalue}
         getValues={getValues}
         /> */}

         {/* {creating a compinenet for uploafing and showing preview of media} */}
          <Upload
               name="courseImage"
               label="Course Thumbnail"
               register={register}
               setValue={setValue}
               errors={errors}
               editData={editCourse ? course?.thumbnail : null}
             />

         {/* benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup></label>
            <textarea
              id='coursebenefits'
              placeholder='enter benefits of the course'
              {...register("courseBenefits",{required:true})}
              className=' form-style resize-x-none min-h-[130px] w-full'
          />
          {
            errors.courseBenefits && (
               <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Benefits of the course are required
                </span>
            )
          }
         </div>


         <RequirementField
           name="courseRequirements"
           label="Requirements/instructions"
           register={register}
           errors={errors}
           setValue={setValue}
           getValues={getValues}
         
         />
         <div>
            {
                editCourse && (
                    <button 
                    onClick={()=>dispatch(setStep(2))}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue without Saving
                    </button>
                )
            }

            <IconBtn
               text={!editCourse ? "Next" : "Save Changes"}
               />
         </div>

      
    </form>
  )
}

export default CourseInformationForm
