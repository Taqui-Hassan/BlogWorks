import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { Button, CardBox, Container, PostCard } from '../components'
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
    // const sentence = CardBox.para;
    // const result = sentence.split(" ").join("-");

    if (posts.length === 0) {
        return (
            <div className='min-h-screen bg-white'>



                <div className="w-full text-center bg-white">

                    <div className="bg-colorBlue p-5">

                        <h1 className=" font-bold text-white">

                            Welcome to BlogWorks !!!

                        </h1>
                        <div className='text-white text-sm'>
                            You have the ideas, the passion, and the expertise. We provide the tools and insights to transform them into powerful, professional content. Whether you're a seasoned blogger, a content marketer, or just starting your writing journey, BlogWorks is your partner in crafting posts that captivate, connect, and convert.
                        </div>
                        <Link to='/add-post'>
                            <button className='text-black duration-100 hover:bg-blue-200 cursor-pointer text-xs rounded-2xl p-2 bg-colorOrange'
                            >Click Here to Create your Blog</button>

                        </Link>


                    </div>


                </div>

                <div className='flex flex-wrap gap-2 pl-2 pb-2'>
                    <Link to='/all-posts'>
                        <CardBox className='text-black' para="Why Learning JavaScript Can Change Your Career Path">

                        </CardBox>

                    </Link>


                    <Link to='/all-posts'>

                        <CardBox className='text-black' para='10 Simple Habits That Boost Productivity Every Day'>
                        </CardBox>
                    </Link>

                    <Link to='/all-posts'>

                        <CardBox className='text-black' para='The Rise of Remote Work: Pros and Cons You Should Know'>
                        </CardBox>
                    </Link>


                    <Link to='/all-posts'>

                        <CardBox className='text-black' para='How Artificial Intelligence Is Shaping Our Future'>
                        </CardBox>
                    </Link>

                    <Link to='/all-posts'>

                        <CardBox className='text-black' para='Beginner’s Guide to Building a Personal Portfolio Website'>
                        </CardBox>
                    </Link>

                    <Link to='/all-posts'>

                        <CardBox className='text-black' para='Exploring the Future of Space Tourism'>
                        </CardBox>
                    </Link>
                    <Link to={"/post/" + "SAMSUNG GALAXY S24FE 5G".split(" ").join("-")}>
                        <CardBox className='text-black' para='SAMSUNG GALAXY S24FE 5G'>

                        </CardBox>

                    </Link>
                    <Link to='/all-posts'>

                        <button className='text-blue-300 text-xs p-2 mt-3 bg-colorBlue rounded-3xl m-0'>
                            For More Posts Click here..
                        </button>

                    </Link>
                </div>
            </div >
        )
    }

}

export default Home