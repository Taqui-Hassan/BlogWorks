import React from 'react'
import BlogWorks from './images/BlogWorks.webp'
function Logo({width='100px'}) {
  return (
    <div><img src={BlogWorks} alt="" style={{width:width}}/></div>
  )
}

export default Logo