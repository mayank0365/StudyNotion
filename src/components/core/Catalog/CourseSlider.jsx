import React from 'react'
import { Swiper, SwiperSlide} from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/autoplay";
import {Autoplay  , Navigation, FreeMode, Pagination} from 'swiper/modules'

import Course_Card from './Course_Card'



const CourseSlider = ({Courses}) => {
    console.log("course in slider:",Courses);
  return (
    <>
      {
        Courses?.length ? (
              <Swiper
                slidesPerView={3}
                loop={true}
                spaceBetween={150}
         
                pagination={true}
                modules={[Autoplay,Pagination,Navigation]}
                className="mySwiper"
                autoplay={{
                    delay:1000,
                    disableOnInteraction: false,

                }}
                navigation={true}
                breakpoints={{
                    1024:{slidesPerView:3}
                }}
                
                >
                {
                    Courses?.map((course,index)=>(
                        <SwiperSlide key={index}>
                            <Course_Card course={course} Height={"h-[250px]"}/>

                        </SwiperSlide>
                    ))
                } 
              </Swiper>
        ) : (
            <p>No Course Found</p>

        )
      }
    </>
  )
}

export default CourseSlider
