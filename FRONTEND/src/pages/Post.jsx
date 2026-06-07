
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import parse from "html-react-parser"
import { useSelector } from "react-redux"
import { getPost, deletePost as deletePostApi } from "../api/post"
import { toast } from "sonner"

export default function Post() {
  const [post, setPost] = useState(null)
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const userData = useSelector((state) => state.auth.userData)
  const [isAuthor, setIsAuthor] = useState(false)

  useEffect(() => {
    if (slug) {
      getPost(slug)
        .then((res) => {
          if (res?.data) setPost(res.data)
          else navigate("/")
        })
        .catch(() => navigate("/"))
        .finally(() => setIsLoading(false))
    } else navigate("/")
  }, [slug, navigate])

  useEffect(() => {
    if (post && userData) {
      setIsAuthor(String(post.user) === String(userData._id))
    }
  }, [post, userData])

  const deletePost = async () => {
    if (!window.confirm("Delete this story permanently?")) return
    try {
      await deletePostApi(post.slug)
      toast.success("Story deleted.")
      navigate("/all-posts")
    } catch {
      toast.error("Could not delete.")
    }
  }

  if (isLoading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82' }}>Loading story…</p>
    </div>
  )

  if (!post) return null

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh' }}>
      {/* Hero image */}
      {post.FeaturedImg && (
        <div style={{ width: '100%', maxHeight: '480px', overflow: 'hidden' }}>
          <img src={post.FeaturedImg} alt={post.title} style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Article header */}
        <div style={{ borderTop: '3px double #1a1a18', paddingTop: '2rem', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#1a1a18', lineHeight: 1.15, marginBottom: '1rem' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: '#8a8a82', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {isAuthor && (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Link to={`/edit-post/${post.slug}`}>
                  <button className="btn-outline" style={{ fontSize: '0.7rem', padding: '0.3rem 0.9rem' }}>Edit</button>
                </Link>
                <button onClick={deletePost} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#c8392b', color: '#fff', border: '1px solid #c8392b', padding: '0.3rem 0.9rem', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #d4cfc4', marginBottom: '2.5rem' }} />

        {/* Content */}
        <div className="prose-content">
          {post.Content ? parse(post.Content) : null}
        </div>

        {/* Back link */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid #d4cfc4', paddingTop: '1.5rem' }}>
          <Link to="/all-posts" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a18', textDecoration: 'none' }}>
            ← Back to all stories
          </Link>
        </div>
      </div>
    </div>
  )
}
