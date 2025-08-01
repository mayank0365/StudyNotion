import React from 'react'
import HighlightText from '../HighlightText'

const Quote = () => {
  return (
    <div>
      We are passionae about revolutionizing the way we learn, Our innovative platform
      <HighlightText text={"combines technology"}/>

      <span className='text-brown-400'>
        {" "}
        expertise
      </span>
      , and community to create an
      <span className='text-brown-400'>
        {" "}
        unparalleled educational experience
      </span>
    </div>
  )
}

export default Quote
