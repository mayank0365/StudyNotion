import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {
    console.log("viewcourse component mounted")

    const [reviewModal, setReviewModal] = useState(false);
    const {courseId,sectionId,subSectionId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const {courseSectionData,entireCourseData} =useSelector((state)=>state.viewCourse);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const location=useLocation();

      // Derived state for checking if params are missing
  // const isLoadingParams = !sectionId || !subSectionId;


    useEffect(()=> {
        const setCourseSpecificDetails = async() => {
         try{
                 const courseData = await getFullDetailsOfCourse(courseId, token);

            console.log("API raw courseData:", courseData);
          console.log("courseDetails:", courseData?.courseDetails);
           console.log("courseContent:", courseData?.courseDetails?.courseContent);
              dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
              dispatch(setEntireCourseData(courseData.courseDetails));
              dispatch(setCompletedLectures(courseData.completedVideos));
              let lectures = 0;
              courseData.courseDetails.courseContent.forEach((sec) => {
                lectures += sec.subSection.length
              })  ;
              dispatch(setTotalNoOfLectures(lectures));
        }
        catch(error){
          console.error("Failed to fetch course details:",error);
        }
         };
        
        setCourseSpecificDetails();
    },[]);

    useEffect(() => {
    if (
      courseSectionData.length > 0 &&
      (!sectionId || !subSectionId)
    ) {
     
      const firstSectionId = courseSectionData[0]?._id;
      const firstSubSectionId = courseSectionData[0]?.subSection[0]?._id;
     //  console.log(firstSectionId,firstSubSectionId,">>?????????????????????????????????")
      navigate(
        `/view-course/${courseId}/section/${firstSectionId}/sub-section/${firstSubSectionId}`,
         { replace: true }
      );
    }
  }, [courseSectionData, courseId, sectionId, subSectionId, navigate]);

// console.log(courseSectionData,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  return (
    <>
        <div>
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
              <div className="flex-1 overflow-y-auto">
        {(!sectionId || !subSectionId) ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading video...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
            
            
            {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}

           
        </div>
        
    </>
  )
}

export default ViewCourse
