import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAllPosts } from "../api/post"

function AllPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts()
      .then((res) => setPosts(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82' }}>Fetching stories…</p>
    </div>
  )

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Page header */}
        <div style={{ borderTop: '4px solid #1a1a18', borderBottom: '1px solid #d4cfc4', padding: '1.2rem 0', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, margin: 0, color: '#1a1a18' }}>All Stories</h1>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: '#8a8a82', letterSpacing: '0.06em' }}>{posts.length} article{posts.length !== 1 ? 's' : ''}</span>
        </div>

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82', fontSize: '1.1rem' }}>No stories published yet.</p>
            <Link to="/add-Post"><button className="btn-primary" style={{ marginTop: '1.5rem' }}>Write the first one</button></Link>
          </div>
        ) : (
          <div className="masonry-grid">
            {posts.map((post) => (
              <div key={post._id} className="masonry-item">
                <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="post-card" style={{ overflow: 'hidden' }}>
                    {post.FeaturedImg && (
                      <div style={{ overflow: 'hidden' }}>
                        <img src={post.FeaturedImg} alt={post.title} style={{ width: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', maxHeight: '220px' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        />
                      </div>
                    )}
                    <div style={{ padding: '1.1rem 1.2rem 1.4rem' }}>
                      <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.05rem', fontWeight: 700, color: '#1a1a18', margin: '0 0 0.6rem', lineHeight: 1.3 }}>{post.title}</h3>
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', color: '#8a8a82', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllPosts
