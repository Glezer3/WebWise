import { motion } from "framer-motion";
import { staggerContainer } from "../utils/motion";
import "./SectionWrapper.css"

const SectionWrapper = (Component, idName) =>
  function HighOrderComponent() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true /* false */, amount: 0.3 }}
        id="sectionWrapper"
      >

        <span id={idName}>
          &nbsp;
        </span>

        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;