// import { Router } from "express";
// import {
//   createPost,
//   getAllPosts,
//   getPost,
//   updatePost,
//   deletePost,
// } from "../controllers/post.controller.js";

// import { verifyJWT } from "../middlewares/auth.middleware.js";

// const router = Router();

// // Public routes
// router.get("/", getAllPosts);
// router.get("/:slug", getPost);

// // Protected routes
// router.post("/", verifyJWT, createPost);
// router.patch("/:slug", verifyJWT, updatePost);
// router.delete("/:slug", verifyJWT, deletePost);

// export default router;


import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:slug", getPost);
router.post("/", verifyJWT, upload.single("featuredImage"), createPost);
router.patch("/:slug", verifyJWT, upload.single("featuredImage"), updatePost);
router.delete("/:slug", verifyJWT, deletePost);

export default router;
