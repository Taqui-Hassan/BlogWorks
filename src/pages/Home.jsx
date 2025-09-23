import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { Link } from 'react-router-dom';
function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-16 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className=" font-bold text-black text-sm ">
                                
                                    Welcome to BlogWorks Your words, polished to perfection.Whether you’re a blogger, content creator, or business owner, your words deserve to shine. At BlogWorks, we help you edit, refine, and transform your blog posts into engaging, professional content that connects with your readers.
                                
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

}

export default Home