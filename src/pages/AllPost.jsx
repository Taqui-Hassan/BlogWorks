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
    <div className="w-full min-h-screen text-news bg-[url('/public/HomeBg.webp')]">
        <Container>
            <div className='flex flex-wrap text-news'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4 text-news'>
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
            </Container>
    </div>
  )
}

export default AllPosts