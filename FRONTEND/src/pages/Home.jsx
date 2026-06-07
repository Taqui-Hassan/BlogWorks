import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { getAllPosts } from "../api/post"

const TIMER_SECONDS = 8

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const postsRef = useRef([])
  const heroIndexRef = useRef(0)

  useEffect(() => {
    getAllPosts()
      .then((res) => {
        const data = res?.data || []
        postsRef.current = data
        setPosts(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (posts.length <= 1) return

    let elapsed = 0
    const INTERVAL_MS = 50

    const id = setInterval(() => {
      elapsed += INTERVAL_MS
      const pct = (elapsed / (TIMER_SECONDS * 1000)) * 100
      setProgress(pct)

      if (elapsed >= TIMER_SECONDS * 1000) {
        elapsed = 0
        setProgress(0)
        setAnimating(true)
        setTimeout(() => {
          const next = (heroIndexRef.current + 1) % postsRef.current.length
          heroIndexRef.current = next
          setHeroIndex(next)
          setAnimating(false)
        }, 200)
      }
    }, INTERVAL_MS)

    return () => clearInterval(id)
  }, [posts])

  const goTo = (idx) => {
    setAnimating(true)
    setProgress(0)
    setTimeout(() => {
      heroIndexRef.current = idx
      setHeroIndex(idx)
      setAnimating(false)
    }, 350)
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82' }}>Loading stories…</p>
    </div>
  )

  if (posts.length === 0) return (
    <div style={{ background: '#faf9f6', minHeight: '80vh' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ borderTop: '3px double #1a1a18', borderBottom: '3px double #1a1a18', padding: '3rem 2rem', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#1a1a18', marginBottom: '1rem', lineHeight: 1.15 }}>
            No stories yet.<br />
            <em style={{ fontStyle: 'italic', color: '#c8392b' }}>Be the first.</em>
          </h1>
          <p style={{ fontFamily: '"Lora", serif', color: '#4a4a45', fontSize: '1rem', lineHeight: 1.7 }}>
            Every great publication starts with a single piece.
          </p>
        </div>
        <Link to="/add-Post"><button className="btn-primary">Start Writing</button></Link>
      </div>
    </div>
  )

  const hero = posts[heroIndex]
  const rest = posts.filter((_, i) => i !== heroIndex)

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

       
        <div style={{ borderTop: '3px double #1a1a18', paddingTop: '2rem', marginBottom: '2.5rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8392b', fontWeight: 500 }}>
              Featured Story
            </span>

            {posts.length > 1 && (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {posts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    title={`Go to story ${i + 1}`}
                    style={{
                      width: i === heroIndex ? '1.6rem' : '0.5rem',
                      height: '0.5rem',
                      borderRadius: '999px',
                      background: i === heroIndex ? '#1a1a18' : '#d4cfc4',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'width 0.3s ease, background 0.2s',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

        
          {posts.length > 1 && (
            <div style={{ height: '2px', background: '#f0ece3', marginBottom: '1.4rem', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: '#c8392b',
                width: `${progress}%`,
                borderRadius: '1px',
              }} />
            </div>
          )}

  
          <Link
            to={`/post/${hero.slug}`}
            style={{
              textDecoration: 'none',
              display: 'grid',
              gridTemplateColumns: hero.FeaturedImg ? '1fr 1fr' : '1fr',
              gap: '2.5rem',
              alignItems: 'center',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {hero.FeaturedImg && (
              <div style={{ overflow: 'hidden' }}>
                <img
                  src={hero.FeaturedImg}
                  alt={hero.title}
                  style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              </div>
            )}
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#1a1a18', margin: '0.4rem 0 1rem', lineHeight: 1.2 }}>
                {hero.title}
              </h2>
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8a82' }}>
                {new Date(hero.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <div style={{ marginTop: '1.5rem' }}>
                <span className="btn-outline" style={{ display: 'inline-block' }}>Read Story →</span>
              </div>
            </div>
          </Link>
        </div>

    
        {rest.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 0 2rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#d4cfc4' }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8a82' }}>More Stories</span>
              <div style={{ flex: 1, height: '1px', background: '#d4cfc4' }} />
            </div>

            <div className="masonry-grid">
              {rest.map((post) => (
                <div key={post._id} className="masonry-item">
                  <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="post-card" style={{ overflow: 'hidden' }}>
                      {post.FeaturedImg && (
                        <div style={{ overflow: 'hidden' }}>
                          <img src={post.FeaturedImg} alt={post.title}
                            style={{ width: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', maxHeight: '220px' }}
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
          </>
        )}
      </div>
    </div>
  )
}

export default Home