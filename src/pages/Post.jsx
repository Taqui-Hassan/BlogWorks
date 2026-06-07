import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const userData = useSelector((state) => state.auth.userData);
    const [isAuthor, setIsAuthor] = useState(false);
   
    console.log("Post Author ID:", isAuthor);
    console.log("Logged-in User Data:", userData);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((postData) => {
                if (postData) setPost(postData);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);
    useEffect(() => {
        if (post && userData) {
            setIsAuthor(post.UserId === userData.$id);
            setIsLoading(false);
        } else if(post){
            setIsLoading(false);
        }
        // setIsAuthor(false);
    }, [post, userData]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.FeaturedImg);
                navigate("/all-posts");
            }
        });
    };
    if (isLoading) {
        return (
            <div className="py-8 min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Loading...</h1>
                
            </div>
        );
    }

    return post ? (
        <div className="min-h-screen bg-[url('/HomeBg.webp')]">
            <Container>
                <div className="w-full flex justify-center mb-4 relative p-2 text-black">
                    {/* {console.log("Featured Image ID being used:", post.featuredImg)}
                    <img
                        src={appwriteService.getFilePreview(post.FeaturedImg)}
                        alt={post.title}
                        className="rounded-xl text-black font-bold"
                    /> */}

                    {isAuthor && (
                        <div className="absolute right-6 top-6 ">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button  className="text-xs mr-3 bg-loginColor cursor-pointer">
                                    Edit
                                </Button>
                            </Link>
                            <Button className="text-xs bg-red-500 cursor-pointer" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6 text-black">
                    <h1 className="text-sm font-bold text-black">{post.title}</h1>
                </div>
                <div className="browser-css text-black text-sm">
                     {post.Content ? parse(post.Content) : null}
                    </div>
            </Container>
        </div>
    ) : null;
}