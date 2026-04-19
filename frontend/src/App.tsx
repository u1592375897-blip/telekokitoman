import { ThemeProvider } from './lib/theme'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import YouTubeSection from './components/YouTubeSection'
import About from './components/About'
import Redes from './components/Redes'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <YouTubeSection />
        <About />
        <Redes />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </ThemeProvider>
  )
}

export default App
