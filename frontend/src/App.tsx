import Navbar from './components/Navbar'
import Hero from './components/Hero'
import YouTubeSection from './components/YouTubeSection'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <YouTubeSection />
        <About />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}

export default App
