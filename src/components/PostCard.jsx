import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
function PostCard({ $id, title, FeaturedImg }) {
  return (

    <div className='w-full bg-postnews rounded-xl p-4 text-sm font-bold text-news'>
      <div className='w-full justify-center mb-4 '>
        {title}
        {/* <img src={ appwriteService.getFilePreview(FeaturedImg) } alt={title}/> */}
      </div>
      <Link to={`/post/${$id}`}>
        <button className='cursor-pointer rounded-2xl bg-black text-news p-2 hover:bg-blue-300'>Click here to Open Article</button>
      </Link>

    </div>

  )
}

export default PostCard