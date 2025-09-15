import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-Post", active: authStatus },
  ]

  return (
    <header className='py-3 shadow bg-black border border-b-white'>
      <Container>
        <nav className="flex items-center">
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>
          <ul className='flex ml-auto space-x-4'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='text-amber-50 inline-block px-6 py-2 duration-200 hover:bg-amber-300     rounded-full'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
