import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Chatbot from './components/Chatbot'
import PageInicio from './pages/PageInicio'
import PageVideos from './pages/PageVideos'
import PageColeccion from './pages/PageColeccion'
import PageSobreMi from './pages/PageSobreMi'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<PageInicio />} />
          <Route path="/videos"     element={<PageVideos />} />
          <Route path="/coleccion"  element={<PageColeccion />} />
          <Route path="/sobre-mi"   element={<PageSobreMi />} />
        </Routes>
      </Layout>
      <Chatbot />
    </BrowserRouter>
  )
}

export default App
