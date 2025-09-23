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

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.UserId === userData.$id : false;
    console.log("Post Author ID:", isAuthor);
    console.log("Logged-in User Data:", userData);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.FeaturedImg);
                navigate("/all-posts");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border p-2 text-black">
                    {console.log("Featured Image ID being used:", post.featuredImg)}
                    <img
                        src={appwriteService.getFilePreview(post.FeaturedImg)}
                        alt={post.title}
                        className="rounded-xl text-black font-bold"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6 ">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button  className="mr-3 bg-amber-50 cursor-pointer">
                                    Edit
                                </Button>
                            </Link>
                            <Button className="bg-red-500 cursor-pointer" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6 text-white">
                    <h1 className="text-sm font-bold text-white">{post.title}</h1>
                </div>
                <div className="browser-css text-white text-sm">
                     {post.Content ? parse(post.Content) : null}
                    </div>
            </Container>
        </div>
    ) : null;
}