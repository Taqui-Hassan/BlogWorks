import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
function PostCard({$id,title,FeaturedImg }) {
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-700 rounded-xl p-4 text-sm'>
            <div className='w-full justify-center mb-4'>
                <img src={ appwriteService.getFilePreview(FeaturedImg) } alt={title}/>
            </div>
            

        </div>
    </Link>
  )
}

export default PostCard