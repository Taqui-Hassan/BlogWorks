import React, { useCallback, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { RTE } from "../index"
import { useNavigate } from "react-router-dom"
import api from "../../api/client"
import { toast } from "sonner"

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      Content: post?.Content || "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiPanel, setAiPanel] = useState(false)
  const [aiMode, setAiMode] = useState(null)
  const [aiResult, setAiResult] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const abortRef = useRef(null)
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState(post?.FeaturedImg || null)

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value.trim().toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    return ""
  }, [])

  React.useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name === "title") setValue("slug", slugTransform(value.title))
    })
    return () => sub.unsubscribe()
  }, [watch, slugTransform, setValue])

  const submit = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("slug", slugTransform(data.title))
      formData.append("Content", data.Content)
      formData.append("Status", "active")
      if (data.featuredImage?.[0]) formData.append("featuredImage", data.featuredImage[0])

      if (post) {
        const res = await api.patch(`/posts/${post.slug}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
        if (res.data?.data) { toast.success("Story updated!"); navigate(`/post/${res.data.data.slug}`) }
      } else {
        const res = await api.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } })
        if (res.data?.data) { toast.success("Story published!"); navigate(`/post/${res.data.data.slug}`) }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const runAI = async (mode) => {
    const title = getValues("title")
    const content = getValues("Content")
    const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

    if (!plainText && mode !== "title" && mode !== "creative") { toast.error("Write some content first!"); return }
    if (!title && !plainText && mode !== "creative") { toast.error("Write something first!"); return }

    setAiPanel(true)
    setAiMode(mode)
    setAiResult("")
    setAiLoading(true)

    const prompts = {
      improve: `You are an expert editor for a literary blog. Improve the writing below — make it more engaging, fix grammar, improve flow and word choice. Keep the author's voice. Return only the improved text, no commentary.\n\nTitle: ${title}\n\nContent:\n${plainText}`,
      summarize: `Summarize the following blog post in 2-3 punchy sentences that would work as a subtitle or preview blurb. Return only the summary, no intro.\n\nTitle: ${title}\n\nContent:\n${plainText}`,
      title: `Suggest 5 compelling, click-worthy titles for a blog post with this content. Make them specific and varied in style. Return a numbered list only.\n\nCurrent title: ${title || "(none)"}\n\nContent:\n${plainText}`,
      outline: `Based on this blog post draft, suggest an improved structure with section headings and one-line descriptions. Return as a clean numbered outline only.\n\nTitle: ${title}\n\nContent:\n${plainText}`,
      draft: `You are a skilled blog writer. Write a complete, well-structured blog post for the following title. Make it engaging, informative, and around 300-400 words. Use proper paragraphs. Return only the blog post content, no meta commentary.\n\nTitle: ${title}`,
      creative: `Suggest 5 compelling, click-worthy trendy subjects for a blog post with this content. Make them specific and varied in style. Return a numbered list only.`
    }

    try {
      abortRef.current = new AbortController()

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          stream: true,
          messages: [{ role: "user", content: prompts[mode] }],
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err?.error?.message || `Request failed: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop()

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith("data: ")) continue
          const data = trimmed.slice(6)
          if (data === "[DONE]") continue
          try {
            const parsed = JSON.parse(data)
            const text = parsed?.choices?.[0]?.delta?.content
            if (text) setAiResult(prev => prev + text)
          } catch {
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error(err.message || "AI request failed")
        setAiPanel(false)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const stopAI = () => { abortRef.current?.abort(); setAiLoading(false) }

  const applyImproved = () => {
    setValue("Content", `<p>${aiResult.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`)
    toast.success("Content updated!")
    setAiPanel(false)
  }

  const labelStyle = { fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8a82', display: 'block', marginBottom: '0.4rem' }
  const inputStyle = { fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem', border: 'none', borderBottom: '1.5px solid #d4cfc4', background: 'transparent', padding: '0.5rem 0', width: '100%', color: '#1a1a18', outline: 'none' }
  const aiBtnStyle = (color = '#4a4a45') => ({ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: `1px solid ${color}`, color, padding: '0.35rem 0.8rem', cursor: 'pointer', transition: 'all 0.15s' })

  const modeLabels = {
    improve: "✍️ Improve Writing",
    summarize: "📝 Summarize",
    title: "💡 Title Ideas",
    outline: "🗂 Suggest Structure",
    draft: "🪄 Write For Me",
    creative: '🤔 Suggest a Trendy Subject'
  }

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: aiPanel ? '1300px' : '900px', margin: '0 auto', padding: '2.5rem 1.5rem', transition: 'max-width 0.3s ease' }}>

        <div style={{ borderTop: '4px solid #1a1a18', paddingTop: '1.5rem', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, color: '#1a1a18', margin: 0 }}>
            {post ? "Edit Story" : "Write a New Story"}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: aiPanel ? '1fr 380px' : '1fr', gap: '2rem', alignItems: 'start' }}>

          <form onSubmit={handleSubmit(submit)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '2rem', alignItems: 'start' }}>

              <div>
                <div style={{ marginBottom: '1.8rem' }}>
                  <label style={labelStyle}>Title</label>
                  <input style={{ ...inputStyle, fontSize: '1.1rem', fontFamily: '"Playfair Display", serif' }}
                    placeholder="Your story title…"
                    {...register("title", { required: true })}
                  />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.4rem', padding: '0.8rem', background: '#f4f1ea', border: '1px solid #e8e3d9' }}>
                  <span style={{ ...labelStyle, marginBottom: 0, alignSelf: 'center', marginRight: '0.3rem', color: '#c8392b' }}>✦ AI</span>
                  {Object.entries(modeLabels).map(([mode, label]) => (
                    <button key={mode} type="button"
                      onClick={() => runAI(mode)}
                      style={aiBtnStyle(aiMode === mode && aiPanel ? '#c8392b' : '#4a4a45')}
                      onMouseEnter={e => { e.currentTarget.style.background = '#1a1a18'; e.currentTarget.style.color = '#faf9f6'; e.currentTarget.style.borderColor = '#1a1a18' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = aiMode === mode && aiPanel ? '#c8392b' : '#4a4a45'; e.currentTarget.style.borderColor = aiMode === mode && aiPanel ? '#c8392b' : '#4a4a45' }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div>
                  <label style={labelStyle}>Content</label>
                  <RTE name="Content" control={control} defaultValue={getValues("Content")} />
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #d4cfc4', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8a82', margin: '0 0 1.4rem', borderBottom: '1px solid #d4cfc4', paddingBottom: '0.8rem' }}>
                  Story Settings
                </h3>

                <div style={{ marginBottom: '1.6rem' }}>
                  <label style={labelStyle}>
                    Featured Image{' '}
                    <span style={{ color: '#b0aca4', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </label>

                  <label
                    htmlFor="featuredImageInput"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: '0.5rem', marginTop: '0.5rem',
                      border: '1.5px dashed #d4cfc4', borderRadius: '8px',
                      padding: imagePreview ? '0' : '1.2rem 1rem',
                      cursor: 'pointer', background: '#faf9f6',
                      transition: 'all 0.2s ease', overflow: 'hidden',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (!imagePreview) { e.currentTarget.style.borderColor = '#1a1a18'; e.currentTarget.style.background = '#f4f1ea' } }}
                    onMouseLeave={e => { if (!imagePreview) { e.currentTarget.style.borderColor = '#d4cfc4'; e.currentTarget.style.background = '#faf9f6' } }}
                  >
                    {imagePreview ? (
                      <div style={{ position: 'relative', width: '100%' }}>
                        <img
                          src={imagePreview}
                          alt="preview"
                          style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
                        />
                        <div
                          style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,24,0.55)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                            🔄 Change image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a8a82' }}>
                          Click to upload image
                        </span>
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem', color: '#b0aca4' }}>
                          PNG, JPG, GIF, WEBP
                        </span>
                      </>
                    )}
                  </label>

                  <input
                    id="featuredImageInput"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                    style={{ display: 'none' }}
                    {...register("featuredImage", {
                      onChange: (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = URL.createObjectURL(file)
                          setImagePreview(url)
                        }
                      }
                    })}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.78rem' }}>
                  {isSubmitting ? "Saving…" : post ? "Update Story" : "Publish Story"}
                </button>
              </div>
            </div>
          </form>

          {aiPanel && (
            <div style={{ background: '#ffffff', border: '1px solid #d4cfc4', padding: '1.5rem', position: 'sticky', top: '1.5rem', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid #d4cfc4' }}>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a1a18', fontWeight: 600 }}>
                  ✦ {modeLabels[aiMode]}
                </span>
                <button onClick={() => { stopAI(); setAiPanel(false) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a8a82', fontSize: '1rem' }}>✕</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                {aiLoading && !aiResult && (
                  <div style={{ display: 'flex', gap: '0.4rem', padding: '1rem 0', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c8392b', display: 'inline-block', animation: `bounce 1s ${i * 0.15}s infinite ease-in-out` }} />
                    ))}
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', color: '#8a8a82', marginLeft: '0.5rem' }}>Thinking…</span>
                  </div>
                )}
                <div style={{ fontFamily: aiMode === 'improve' ? '"Lora", serif' : '"DM Sans", sans-serif', fontSize: '0.875rem', lineHeight: 1.75, color: '#1a1a18', whiteSpace: 'pre-wrap' }}>
                  {aiResult}
                  {aiLoading && aiResult && (
                    <span style={{ display: 'inline-block', width: '2px', height: '1em', background: '#c8392b', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'blink 0.8s infinite' }} />
                  )}
                </div>
              </div>

              {!aiLoading && aiResult && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #d4cfc4', paddingTop: '1rem' }}>
                  {(aiMode === 'improve' || aiMode === 'draft') && (
                    <button onClick={applyImproved} className="btn-primary" style={{ fontSize: '0.72rem', padding: '0.4rem 1rem' }}>
                      Apply to editor
                    </button>
                  )}
                  <button onClick={() => runAI(aiMode)} style={{ ...aiBtnStyle(), fontSize: '0.72rem', padding: '0.4rem 1rem' }}>
                    Try again
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(aiResult); toast.success("Copied!") }}
                    style={{ ...aiBtnStyle('#8a8a82'), fontSize: '0.72rem', padding: '0.4rem 1rem' }}>
                    Copy
                  </button>
                </div>
              )}
              {aiLoading && (
                <button onClick={stopAI}
                  style={{ ...aiBtnStyle('#c8392b'), fontSize: '0.72rem', padding: '0.5rem 1rem', width: '100%', marginTop: '0.5rem' }}>
                  Stop generating
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}