import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { chip } from "../assets";
import "../../src/styles.css";

const Default = () => {
  const { currentUser } = useSelector(state => state.user);
  const id = currentUser ? currentUser._id : null;
        return (
            <section id="sectionHero">
              <section id="heroShape" >
              <div id="heroText">
                <h3>Say <q>yes</q> to the automation</h3>
                <h1><span>Monitoring</span> Environments, Connecting through <span>Web</span>: </h1>
                <h1>Your <span>Home</span>, Monitored and <span>Managed</span> with Ease!</h1>
                <div>Experience seamless home control through our intuitive web platform. Stay informed, <br /> stay secure, with real-time insights at your fingertips.
                Embrace the future of smart living, <br /> where empowerment meets simplicity. Your home, your rules, effortlessly managed online.
                </div>
                <Link to={ currentUser ? `/sensors/${id}` : "/signup"} className="button">Let&apos;s get started</Link>
              </div>
              <div id="heroImg">
                <img src={chip} alt="CHIP" />
              </div>
              </section>
            </section>
          );
}
export default Default