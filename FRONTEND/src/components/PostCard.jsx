import React from "react";
import { Link } from "react-router-dom";

function PostCard({ _id, slug, title, FeaturedImg }) {
  return (
    <div className="w-full bg-postnews rounded-xl p-4 text-sm font-bold text-news">
      
      {FeaturedImg && (
        <div className="w-full mb-3">
          <img
            src={FeaturedImg}
            alt={title}
            className="rounded-lg w-full object-cover max-h-40"
          />
        </div>
      )}
      <div className="w-full justify-center mb-4">{title}</div>
      <Link to={`/post/${slug}`}>
        <button className="cursor-pointer rounded-2xl bg-black text-news p-2 hover:bg-blue-300">
          Click here to Open Article
        </button>
      </Link>
    </div>
  );
}

export default PostCard;
