import React, { useEffect, useState } from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { Tilt } from "react-tilt";
import { contactTutorial, experiences, contactBall } from "../../constants";
import { fadeIn, textVariant } from "../../utils/motion";
import { SectionWrapper } from "../../HighOrderComponents";
import { ExperiencePropTypes, ContantTutorialPropTypes } from "./PropTypes";
import { BallCanvas } from "../canvas";
import { arrowDown } from "../../assets";
import "./Contact.css";

const ContantTutorialCard = ({
  index,
  title,
  info,
  additionalInfo,
  isMobile,
}) => (
  <Tilt options={{ max: 30, scale: 1, speed: 500 }}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      id="contactCardShape"
    >
      <div id="contactCard">
        <h3 id="contactCardTitle">{title}</h3>

        {isMobile ? (
          <p id="contactCardInfo">{info}</p>
        ) : (
          <p id="contactCardInfo">{[info, additionalInfo]}</p>
        )}
      </div>
    </motion.div>
  </Tilt>
);

ContantTutorialCard.propTypes = ContantTutorialPropTypes.isRequired;

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#0d1117",
        color: "#b0b9c2",
      }}
      contentArrowStyle={{ borderRight: "10px solid  #b0b9c2" }}
      date={experience.date}
      icon={
        <div id="timelineElement">
          <img
            src={experience.icon}
            alt={experience.title}
            id="timelineElementIcon"
          />
        </div>
      }
    >
      <div id="timelineInfo">
        <h2>{experience.title}</h2>
        <p>{experience.content}</p>
      </div>

      <ul id="timelineList">
        {experience.points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

ExperienceCard.propTypes = {
  experience: ExperiencePropTypes.isRequired,
};

const ContactOverview = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 625px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <>
      <div id="contactHolder">
        <div id="contactText">
          <motion.div id="headHolder" variants={textVariant()}>
            <p id="headSubtext">GET IN TOUCH</p>
            <h1 id="headTitle">Contact</h1>
          </motion.div>
          <div id="textHolder">
            <motion.img src={arrowDown} alt="arrowDown" id="contactArrowDown" variants={fadeIn("right", "spring", 0.25, 0.75)} />
            {contactTutorial.map((tutorialCard, index) => (
              <ContantTutorialCard
                key={tutorialCard.title}
                index={index}
                isMobile={isMobile}
                {...tutorialCard}
              />
            ))}
          </div>
          <div id="contactBallHolder">
            {contactBall.map((contactBall, index) => (
              <motion.div id="contactBalls" key={contactBall.name} variants={fadeIn("right", "spring", index * 0.5, 0.75)}>
                <BallCanvas icon={contactBall.icon} />
              </motion.div>
            ))}
          </div>
        </div>
        <div id="contactTimeline">
          <VerticalTimeline layout="1-column-left">
            {experiences.map((experience, index) => (
              <ExperienceCard key={index} experience={experience} />
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(ContactOverview, "overview");
