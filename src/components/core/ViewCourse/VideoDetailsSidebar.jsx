import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';




const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId, subSectionId} = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state)=>state.viewCourse);
     

   // console.log("coursesection data:",courseSectionData);
    useEffect(()=> {
        const setActiveFlags = () => {
          if (!courseSectionData || courseSectionData.length === 0 || !sectionId || !subSectionId) {
    return;
  }
            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data._id === sectionId
            )
              if (currentSectionIndex === -1) {
    console.warn("Section ID not found in courseSectionData:", sectionId);
    return;
  }

            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSections.findIndex(
                (data) => data._id === subSectionId
            )
              if (currentSubSectionIndex === -1) {
    console.warn("SubSection ID not found in section:", subSectionId);
    return;
  }
            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSections?.[currentSubSectionIndex]?._id;
            //set current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            //set current sub-section here
            setVideoBarActive(activeSubSectionId);
        }
        setActiveFlags();
    },[courseSectionData, courseEntireData, location.pathname])

    const handleAddReview = () => {
        console.log("I am inside Add handleAddReview")
        setReviewModal(true);
    }

  return (
    <>
        <div className='text-white'>
            {/* for buttons and headings */}
            <div>
                {/* for buttons */}
                <div>
                    <div 
                    onClick={()=> {
                        navigate("/dashboard/enrolled-courses")
                    }}
                    >
                        Back
                    </div>

                    <div>
                        <IconBtn 
                            text="Add Review"
                            onClick={handleAddReview}
                        />
                    </div>

                </div>
                {/* for heading or title */}
                <div>
                    <p>{courseEntireData?.courseName}</p>
                    <p>{completedLectures?.length} / {totalNoOfLectures}</p>
                </div>
            </div>

            {/* for sections and subSections */}
            <div>
                {
                    courseSectionData.map((course, index)=> (
                        <div
                        onClick={() => setActiveStatus(course?._id)}
                        key={index}
                        >

                            {/* section */}

                            <div>
                                <div>
                                    {course?.sectionName}
                                </div>
                                {/* HW- add icon here and handle rotate 180 logic */}
                            </div>

                            {/* subSections */}
                            <div>
                                {
                                    activeStatus === course?._id && course?.subSections?.length > 0 && (
                                        <div>
                                            {
                                                course.subSections.map((topic, index) => (
                                                    <div
                                                    className={`flex gap-5 p-5 ${
                                                        videoBarActive === topic._id
                                                        ? "bg-yellow-200 text-richblack-900"
                                                        : "bg-richblack-900 text-white"
                                                    }`}
                                                    key={index}
                                                    onClick={() => {

                                                        // const cId=courseEntireData?._id;
                                                        // const sId=course?._id;
                                                        // const subId=topic?._id;                                                        
                                                        console.log("Navigating with:", {
                                                            cId: courseEntireData?._id,
                                                              sId: course?._id,
                                                                subId: topic?._id
                                                            });



                                                        //   if (!cId || !sId || !subId) {
                                                        //         console.warn("Missing param for navigation:", { cId, sId, subId });
                                                        //             return;
                                                        //           }
                                                        if(courseEntireData?._id && course?._id && topic?._id){
                                                            navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`);
                                                            setVideoBarActive(topic?._id);
                                                        }
                                                    }}
                                                    >
                                                        <input
                                                        type='checkbox'
                                                        checked= {completedLectures.includes(topic?._id)}
                                                        onChange={() => {}}
                                                          onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <span>
                                                            {topic.title}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar
