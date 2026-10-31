import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import ProjectsSection from '../components/ProjectsSection'
import TechSection from '../components/TechSection'
import InterestsSection from '../components/InterestsSection'
import ContactSection from '../components/ContactSection'

export default function Home({ onNavigate, onSection }) {
  return (
    <>
      <Hero onSection={onSection} />
      <AboutSection onNavigate={onNavigate} />
      <ProjectsSection />
      <TechSection />
      <InterestsSection />
      <ContactSection />
    </>
  )
}
