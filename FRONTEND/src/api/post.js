import api from "./client";

// Get all posts (public)
export async function getAllPosts() {
  const res = await api.get("/posts");
  return res.data;
}

// Get single post by slug (public)
export async function getPost(slug) {
  const res = await api.get(`/posts/${slug}`);
  return res.data;
}

// Create a new post (protected)
export async function createPost({ title, slug, Content, Status }) {
  const res = await api.post("/posts", { title, slug, Content, Status });
  return res.data;
}

// Update a post by slug (protected)
export async function updatePost(slug, { title, Content, Status }) {
  const res = await api.patch(`/posts/${slug}`, { title, Content, Status });
  return res.data;
}

// Delete a post by slug (protected)
export async function deletePost(slug) {
  const res = await api.delete(`/posts/${slug}`);
  return res.data;
}
