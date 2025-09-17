import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })



    }, [])
  return (
    <div className='w-full py-8 text-white'>
        <Container>
            <div className='flex flex-wrap text-white'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4 text-white'>
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
            </Container>
    </div>
  )
}

export default AllPosts