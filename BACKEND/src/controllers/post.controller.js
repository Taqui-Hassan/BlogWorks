import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE POST
export const createPost = asyncHandler(async (req, res) => {
  const { title, slug, Content, Status } = req.body;
  console.log("req.file:", req.file)
  console.log("req.body:", req.body)

  if (!title || !slug) {
    throw new ApiError(400, "Title and slug are required");
  }

  // Upload image to Cloudinary
  let FeaturedImg = "";
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    if (uploaded) {
      FeaturedImg = uploaded.secure_url;
    }
  }

  const post = await Post.create({
    title,
    slug,
    Content,
    Status,
    FeaturedImg,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

// GET ALL POSTS
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// GET SINGLE POST
export const getPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug });

  if (!post) throw new ApiError(404, "Post not found");

  return res.status(200).json(new ApiResponse(200, post, "Post fetched"));
});

// UPDATE POST
export const updatePost = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updateData = { ...req.body };


  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    if (uploaded) {
      updateData.FeaturedImg = uploaded.secure_url;
    }
  }

  const updated = await Post.findOneAndUpdate(
    { slug },
    { $set: updateData },
    { new: true }
  );

  if (!updated) throw new ApiError(404, "Post not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Post updated successfully"));
});

// DELETE POST
export const deletePost = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const deleted = await Post.findOneAndDelete({ slug });

  if (!deleted) throw new ApiError(404, "Post not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});
