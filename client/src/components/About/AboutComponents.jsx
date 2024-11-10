import React, { useState } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { Components } from "../../constants";
import { SectionWrapper } from "../../HighOrderComponents";
import "./About.css";

const Component = () => {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  return (
    <section id="componentsHolder">
      <div id="infoHolder">
        <p id="headSubtext">WHAT WE USE</p>
        <h1 id="headTitle">COMPONENTS</h1>
      </div>
      {Components.slice(0, visibleCount).map((component, index) => (
        <Tilt key={index} options={{ max: 5, scale: 1, speed: 350 }}>
          <motion.div
            className="componentCardShape"
            variants={index % 2 === 0 ? fadeIn("right", "spring", 0.5 * index, 0.8) : fadeIn("left", "spring", 0.5 * index, 0.8)}
            initial="hidden"
            animate="show"
          >
            <div className={`componentCard ${index % 2 === 0 ? "componentsTypeIRTL" : "componentsTypeILTR"}`}>
              <div className="textFormation">
                <h3>{component.title}</h3>
                <p>{component.info}</p>
                <a href={component.url} target="_blank" rel="noreferrer">Download Datasheet</a>
              </div>
              <div className="imgFormation">
                <img src={component.image} alt={component.title} />
              </div>
            </div>
          </motion.div>
        </Tilt>
      ))}
      {visibleCount < Components.length && (
        <button onClick={handleShowMore} className="button">
          Show More
        </button>
      )}
    </section>
  );
};

export default SectionWrapper(Component, "components");
