import React from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating'
import { Link } from 'react-router-dom'
import {useState,useEffect} from 'react';


const Course_Card = ({course,Height}) => {
  //  console.log("hello bhaiyo i am in ");
    
   // console.log("course card recieved",course);

    const [avgReviewCount,setAvgReviewCount]=useState(0);

    useEffect(()=>{
      const count=GetAvgRating(course.ratingAndReviews);

      setAvgReviewCount(count);
    },[course])


  return (
    <>
     
      <Link to={`/courses/${course._id}`}>
          <div className="">
              <div className="rounded-lg">
                 <img
                 src={course?.thumbnail}
                 alt='course ka thumnail'
                 className={`${Height} w-full rounded-xl object-cover`}/>
              </div>
              <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
                <p className="text-xl text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                <div className="flex items-center gap-2">
                    <span className="text-yellow-5">{avgReviewCount || 0}</span>
                    <RatingStars Review_Count={avgReviewCount}/>
                    <span>{course?.ratingAndReviews?.length} Ratings</span>
                </div>
                <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
              </div>
          </div>
      </Link>

    </>
  )
}

export default Course_Card
