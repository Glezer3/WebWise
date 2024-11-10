import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { BallCanvas } from "../canvas";
import { skillBall } from "../../constants";
import { SectionWrapper } from "../../HighOrderComponents";
import "./About.css";

const Skills = () => {
    return (
        <section id="skillsHolder">
            <div id="skillsBallsHolder">
            {skillBall.map((skillBall, index) => (
              <motion.div className="skillBalls" key={skillBall.name + index} variants={fadeIn("right", "spring", index * 0.2, 0.5)}>
                <BallCanvas icon={skillBall.icon} />
              </motion.div>
            ))}
            </div>
        </section>
    )
}

export default SectionWrapper(Skills, 'canvas')