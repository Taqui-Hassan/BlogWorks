import React from 'react'
import  Container from '../components/container/Container'
import  PostForm from '../components/post-form/PostForm'
function AddPost() {
  return (
    <div className="min-h-screen bg-[url('/public/HomeBg.webp')]">
        <Container>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost