import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Header from '@/sections/Header'
import Home from '@/pages/Home'
import Atlas from '@/pages/Atlas'
import Journeys from '@/pages/Journeys'
import CollectionDetail from '@/pages/CollectionDetail'
import Destination from '@/pages/Destination'
import SiteFooter from '@/sections/SiteFooter'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen bg-forest font-body text-fg">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/journeys" element={<Journeys />} />
          <Route path="/journeys/:id" element={<CollectionDetail />} />
          <Route path="/destination/:slug" element={<Destination />} />
        </Routes>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}
