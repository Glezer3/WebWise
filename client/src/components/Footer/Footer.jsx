import { SectionsByPage, socialMedias, Contact } from "../../constants";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { SectionWrapper } from "../../HighOrderComponents";
import "./Footer.css"

const Footer = () => {
    const [sectionLinks, setSectionLinks] = useState([]);

useEffect(() => {
   const currentPage = location.pathname;
  
   const sections = SectionsByPage[currentPage] || [];

   const links = sections.map((section, index) => (
        <a key={index} href={`#${section}`}>
        {section}
        </a>
  ));
  setSectionLinks(links);
}, []) 

    return (
        <motion.footer id="footer" variants={fadeIn("up", "spring", 0.15, 1)}>
            <div id="p1">
                <div className="footerHolder" id="footerSocialMediasHolder">
                <p>Social Medias:</p>
                <ul className="footerList" id="footerSocialMedias">
                    {socialMedias.map((link, index) => ( 
                    <li key={index} className="footerSocialMedia">
                    <a href={link.url}>
                    <img src={`${link.icon}`} alt={link.title} />
                    <p>{link.title}</p>
                    </a>
                    </li>
                ))}
                </ul>
                </div>
            </div>
            <div id="p2">
            <div className="footerHolder" id="footerContactsHolder">
                <p id="pc">Contact:</p>
                <ul className="footerList" id="footerContacts">
                    {Contact.map((link, index) => (
                        <li key={index}>
                            <a href="https://www.google.com/maps/@48.4502704,18.9065096,3a,75y,1.5h,92.51t/data=!3m7!1e1!3m5!1skKSChKnuzRAZCg5vIZ3oGw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DkKSChKnuzRAZCg5vIZ3oGw%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D96.52896%26pitch%3D0%26thumbfov%3D100!7i16384!8i8192?entry=ttu"><p>{link.address}</p></a>
                            <p>{link.phone}</p>
                        </li>
                    ))}
                </ul>
            
            </div>
            </div>
            <div id="p3">
            <div className="footerHolder" id="footerSectionsHolder">
                <p>Sections:</p>
                <ul className="footerList" id="footerSections">
                    <Link className="footerSection" onClick={() => {window.scrollTo(0,0);}}><p>primary</p></Link>
                    {sectionLinks.map((link, index) => ( 
                    <li key={index} className="footerSection">
                        <a href={link}>{link}</a>
                    </li> ))}
                </ul>
            </div>
            </div>
        </motion.footer>
    )
}

export default SectionWrapper(Footer, "footer")