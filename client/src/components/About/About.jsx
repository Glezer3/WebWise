import Services from "./AboutServices.jsx";
import Skills from "./AboutSkills.jsx";
import Testimonials from "./AboutTestimonials.jsx";
import Components from "./AboutComponents.jsx";
import Footer from "../Footer/Footer.jsx";
import { StarsCanvas } from "../canvas";
import "./About.css";

const About = () => {
  return (
      <div>
          <div>
            <Services />
            <Skills />
            <Components />
            <Testimonials />
          </div>
            <Footer />
    </div>
  )
}

export default About