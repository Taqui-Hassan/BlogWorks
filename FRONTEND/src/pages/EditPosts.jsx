import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { getPost } from "../api/post";

function EditPost() {
  const [post, setPosts] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      getPost(slug)
        .then((res) => {
          const postData = res?.data;
          if (postData) setPosts(postData);
          else navigate("/");
        })
        .catch(() => navigate("/"));
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  return post ? (
    <div className="bg-[url('/HomeBg.webp')]">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
