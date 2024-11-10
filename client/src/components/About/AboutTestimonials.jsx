import  {Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils/motion";
import { Tilt } from "react-tilt";
import { Feedbacks } from "../../constants";
import { SectionWrapper } from "../../HighOrderComponents";
import "swiper/swiper-bundle.css";
import "./About.css";

const TestimonialCard = ( testimonial ) => {
    const handleShare = async () => {
          if (navigator.share) {
            navigator.clipboard.writeText(testimonial.author + "'s feedback: " + testimonial.feedback);
            try {
              await navigator.share({
                title: testimonial.title,
                text: testimonial.feedback,
                url: testimonial.url,
              });
            } catch (error) {
              console.error('Error sharing:', error);
            }
          } else {
            console.warn('Web Share API not supported');
            navigator.clipboard.writeText(testimonial.author + "'s feedback: " + testimonial.feedback);
          }
    }; 

return (
    <div id="testimonialCard">
        <div id="testimonialCardBackground"></div>
        <div id="testimonialCardImgHolder">
            <img src={testimonial.pfp} alt={testimonial.author} />
        </div>
        <div id="testimonialCardTextHolder">
            <p>{testimonial.feedback}</p>
        </div>
        <div id="testimonialCardRatingHolder">
            <p>{testimonial.rating}</p>
        </div>
        <div id="testimonialCardAuthorHolder">
            <p>- {testimonial.author}</p>
            <p>{testimonial.date}</p>
            <a onClick={handleShare}><img src={testimonial.share} alt={testimonial.title} /></a>
        </div>
    </div>
    )
}

const Testimonials = () => {
    const [slidesPerView, setSlidesPerView] = useState(1);

    const handleSlidesPerView = () => {
      const screenWidth = window.innerWidth;
  
      if (screenWidth < 800) {
        return 1;
      } else if (screenWidth < 1350) {
        return 2;
      } else {
        return 3;
      }
    };
  
    useEffect(() => {
      setSlidesPerView(handleSlidesPerView);
  
      const handleResize = () => {
        setSlidesPerView(handleSlidesPerView);
      };
  
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return (
        <section id="testimonialsHolder">
        <motion.div id="testimonialsInfoHolder" variants={textVariant()}>
            <p id="headSubtext">WHAT OUR CUSTOMERS SAY</p>
            <h1 id="headTitle">TESTIMONIALS</h1>
        </motion.div>
        <div id="testimonialsShape">
        <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow]}
        spaceBetween={50}
        slidesPerView={ slidesPerView }
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSlideChange={() => ''}
        onSwiper={() => ''}
        >
                {Feedbacks.map((feedback, index) => (
                    <SwiperSlide key={index}>
                    <Tilt options={{ max: 5, scale: 1, speed: 350 }}>
                    <motion.div className="tesCardBack" variants={fadeIn("right", "spring", 0.5 * index, 0.8)}>
                    <TestimonialCard index={index} {...feedback} />
                    </motion.div>
                    </Tilt>
                    </SwiperSlide> ))}
                    
        </Swiper>
        </div>
        </section>
    )
}

export default SectionWrapper(Testimonials, "testimonials")