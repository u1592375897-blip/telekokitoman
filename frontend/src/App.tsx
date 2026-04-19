import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './lib/theme'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import PageInicio from './pages/PageInicio'
import PageVideos from './pages/PageVideos'
import PageColeccion from './pages/PageColeccion'
import PageSobreMi from './pages/PageSobreMi'
import PageContacto from './pages/PageContacto'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"           element={<PageInicio />} />
            <Route path="/videos"     element={<PageVideos />} />
            <Route path="/coleccion"  element={<PageColeccion />} />
            <Route path="/sobre-mi"   element={<PageSobreMi />} />
            <Route path="/contacto"   element={<PageContacto />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
