
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";
import { SectionWrapper } from "../../HighOrderComponents";
import { services } from "../../constants";
import "./About.css";

const ServiceCard = ({ service }) => {
    return (
      <VerticalTimelineElement
        contentStyle={{
          background: "#0d1117",
          color: "#b0b9c2",
        }}
        contentArrowStyle={{ borderRight: "10px solid  #b0b9c2" }}
        date={service.date}
        icon={
          <div id="timelineElement">
            <img
              src={service.icon}
              alt={service.title}
              id="timelineElementIcon"
            />
          </div>
        }
      >
        <div id="timelineInfo">
          <h2>{service.title}</h2>
          <p>{service.content}</p>
        </div>
  
        <ul id="timelineList">
          {service.points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </VerticalTimelineElement>
    );
};

const Services = () => {
    return (
        <section id="servicesHolder">
            <p id="headSubtext">WHAT DO WE OFFER</p>
            <h1 id="headTitle">SERVICES</h1>

        <div id="aboutTimeline">
          <VerticalTimeline layout="2-columns">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} {...ServiceCard} />
            ))}
          </VerticalTimeline>
        </div>

        </section>
    )
}

export default SectionWrapper(Services, 'services')