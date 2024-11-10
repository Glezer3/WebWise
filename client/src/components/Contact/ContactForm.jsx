import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { slideIn } from "../../utils/motion";
import { useSelector } from "react-redux";

import { StarsCanvas, StylizedPlanetCanvas } from "../canvas";
import { SectionWrapper } from "../../HighOrderComponents";
import "./Contact.css";

const Form = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ error, setError ] = useState(null);
  const [form, setForm] = useState({
    name: currentUser ? currentUser.username : "",
    surname: "",
    email: currentUser ? currentUser.email : "",
    subject: "",
    message: "",
  });
console.log(currentUser)
  const formRef = useRef();

  const [waititng, setWaiting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setWaiting(true);

    emailjs.send(
        'service_d9zhnls',
        'template_1x4opjp',
        {
          from_name: form.name,
          from_surname: form.surname,
          to_name: "Jakub",
          from_email: form.email,
          to_email: "help.webwise@gmail.com", //"jakub.glezl.webpage@gmail.com",
          subject: form.subject,
          message: form.message,
        },
        "WkyZTdJ6U1YN58UGX"
      ).then(
        () => {
          setWaiting(false);
          setError("Thank you. We will get back to you as soon as possible.");

          setForm({
            name: currentUser ? currentUser.username : "",
            surname: "",
            email: currentUser ? currentUser.email : "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          setWaiting(false);
          setError(error);

          console.log("Something went wrong. Please try again.");
        }
      );
  };

  const handleUser = (e) => {
    if (!/[a-zA-Z]/.test(e.key)) e.preventDefault();
   };

   const handleEmail = (e) => {
    if (!/[a-zA-Z0-9-@._]/.test(e.key)) e.preventDefault();
   };

   const handleSubject = (e) => {
    if (!/[a-zA-Z0-9-_]/.test(e.key)) e.preventDefault();
   };

  const handleLabelPosition = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const getLabelStyle = (inputName) => (
    form[inputName] ? { top: "-20%" } : {}
  )

  return (
    
    <div id="holder">
      <motion.div variants={slideIn("left", "tween", 0.25, 1)} id="holderForm">

        <p id="headSubtext">GET IN TOUCH</p>
        <h1 id="headTitle">Contact Us</h1>
        
        <form
          ref={formRef}
          method="POST"
          autoComplete="on"
          onSubmit={handleSubmit}
          id="form"
        >
          <div className="contact_box">
            <span className="holderInput" id="holderName">
              <input
                name="name"
                type="text"
                id="name"
                minLength="3"
                maxLength="35"
                autoComplete="given-name"
                onKeyDown={(e) => handleUser(e)}
                value={form.name}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="name" style={getLabelStyle("name")}>Name</label>
              <div className="underline"></div>
            </span>

            <span className="holderInput" id="holderSurname">
              <input
                name="surname"
                type="text"
                id="surname"
                minLength="3"
                maxLength="35"
                autoComplete="family-name"
                onKeyDown={(e) => handleUser(e)}
                value={form.surname}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="surname" style={getLabelStyle("surname")}>Surname</label>
              <div className="underline"></div>
            </span>
          </div>
          <div className="contact_box">
            <span className="holderInput" id="holderEmail">
              <input
                name="email"
                type="email"
                id="email"
                minLength="10"
                maxLength="50"
                autoComplete="email"
                onKeyDown={(e) => handleEmail(e)}
                value={form.email}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="email" style={getLabelStyle("email")}>E-mail Address</label>
              <div className="underline"></div>
            </span>

            <span className="holderInput" id="holderSubject">
              <input
                name="subject"
                type="text"
                id="subject"
                minLength="3"
                maxLength="35"
                autoComplete="name"
                onKeyDown={(e) => handleSubject(e)}
                value={form.subject}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="subject" style={getLabelStyle("subject")}>Subject</label>
              <div className="underline"></div>
            </span>
          </div>

          <span className="holderInput" id="holderMessage">
            <textarea
              name="message"
              id="message"
              cols="30"
              rows="5"
              minLength="3"
              maxLength="500"
              placeholder="Your Message"
              value={form.message}
              onChange={handleLabelPosition}
              readOnly={waititng ? true : false}
              required
            ></textarea>
            <div className="underline"></div>
          </span>
          <div id="errorHolder" style={{marginBottom: "0.5rem"}}>{error}</div>
          <button type="submit" className="button" id="formButton" style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}}>{waititng ? 'Sending your Message' : 'Send Message'}</button>  
        </form>
      </motion.div>

      <motion.div variants={slideIn("right", "tween", 0.25, 1)} id="holderCanvas">
        <StylizedPlanetCanvas />
      </motion.div>
      <StarsCanvas />
    </div>
  );
};

export default SectionWrapper(Form, "form");
