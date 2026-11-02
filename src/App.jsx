import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import ServiceArea from './pages/ServiceArea.jsx'
import { businessPage, marketPage } from './lib/content.js'
import Insights from './pages/Insights.jsx'
import InsightDetail from './pages/InsightDetail.jsx'
import History from './pages/History.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="bo-app">
      <ScrollToTop />
      <Header />
      <main className="bo-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<ServiceArea key="market" page={marketPage} />} />
          <Route path="/business" element={<ServiceArea key="business" page={businessPage} />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
