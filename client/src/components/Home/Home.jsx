import { useEffect } from "react";
import { projects } from "../../constants";
import { Footer } from "../../components";
import { logo_logo } from "../../assets";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { SectionWrapper } from "../../HighOrderComponents";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/qchhfn9toof3au2rklqmfa3dqoxkcuri.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="homeShape">
      <div id="homeHolder">
        <div id="homeTop"></div>
        <div id="homeLine">
          <div id="homeText">
            <div className="homeTitle">WebWise Home Control</div>
            <div className="homeInfo">
              <p className="infoText">
                offers a seamless and intuitive interface
                to manage your smart home devices.
              </p>
              <p className="infoText">
                Our platform is designed for easy navigation, ensuring that
                users of all tech levels can control their environment
                effortlessly.
              </p>
              <p className="infoText">
                Experience real-time notifications and updates, keeping you
                informed and in control, no matter where you are.
              </p>
            </div>
          </div>
          <img id="homeLogo" src={logo_logo} alt="logo" />
        </div>
        <div id="homeProjectsHolder">
          {projects.map((project, index) => (
            <motion.div
              id="homeProjects"
              key={index}
              variants={fadeIn("top", "spring", 0.5 * index, 0.8)}
              initial="hidden"
              animate="show"
            >
              <div className="homeProject">
                <div className="projectImg">
                  <img src={project.image} alt="projectImg" />
                </div>
                <div className="projectText">
                  <div className="projectTitle">{project.title}</div>
                  <ul className="projectDescription">
                    {project.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SectionWrapper(Home, "");
