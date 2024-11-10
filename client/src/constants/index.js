import {
  discord,
  facebook,
  instagram,
  share,
  scd41,
  bme280,
  veml7700,
  sps30,
  sht35,
  esp32_wroom_32,
  A,
  U,
  T,
  O,
  M,
  I,
  N,
  plus,
  address,
  phone,
  email,
  phoneBall,
  emailBall,
  DATA,
  PMI,
  RAROP,
  TAC,
  buy,
  connect,
  set_up,
  monitor,
} from "../assets";

const navLinks = [
  {
    id: "home",
    title: "Home",
    url: "home",
  },
  {
    id: "about",
    title: "About",
    url: "about",
  },
  {
    id: "contact",
    title: "Contact",
    url: "contact",
  },
  {
    id: "sensors",
    title: "Sensors",
    url: "sensors",
  },
];

const account = [
  {
    id: "signIn",
    title: "Sign in",
    url: "signin",
  },
  {
    id: "signUp",
    title: "Sign up",
    url: "signup",
  },
];

const SectionsByPage = {
  "/home": [""],
  "/about": ["services", "canvas", "components", "testimonials"],
  "/contact": ["form"],
};

const socialMedias = [
  {
    id: "facebook",
    title: "Facebook",
    icon: facebook,
    url: "",
  },
  {
    id: "instagram",
    title: "Instagram",
    icon: instagram,
    url: "",
  },
  {
    id: "discord",
    title: "Discord",
    icon: discord,
    url: "",
  },
];

const Feedbacks = [
  {
    author: "Jack Honso",
    title: "Share Me!",
    date: "review from xxx (xx.xx.xxxx)",
    feedback:
      '"Exceptional service from start to finish. The team at WebWise went above and beyond to meet our needs. ' +
      'Communication was excellent, and the end result exceeded our expectations. Highly recommend!"',
    rating: "★★★★★",
    pfp: facebook,
    share: share,
  },
  {
    author: "Eva Tiramint",
    title: "Share Me!",
    date: "review from xxx (xx.xx.xxxx)",
    feedback:
      '"Impressed with the top-notch quality of products/services provided by WebWise. ' +
      'Every interaction with the team showcased professionalism and expertise. A five-star experience all the way!"',
    rating: "★★★★★",
    pfp: facebook,
    share: share,
  },
  {
    author: "Fedor Klaystes",
    title: "Share Me!",
    date: "review from xxx (xx.xx.xxxx)",
    feedback:
      '"Overall, our experience with WebWise was positive. Just and only the communication could have been more consistent. ' +
      'Nonetheless, the end result met our expectations, and we appreciate the efforts put in. Thanks."',
    rating: "★★★★☆",
    pfp: facebook,
    share: share,
  },
  {
    author: "Ada Wilston",
    title: "Share Me!",
    date: "review from xxx (xx.xx.xxxx)",
    feedback:
      '"WebWise has proven to be reliable and efficient. Their attention to detail and commitment to delivering on time is commendable. ' +
      'Our project was handled with precision, resulting in a successful outcome."',
    rating: "★★★★★",
    pfp: facebook,
    share: share,
  },
  {
    author: "Jan Mulitan",
    title: "Share Me!",
    date: "review from xxx (xx.xx.xxxx)",
    feedback:
      '"While working with WebWise, our experience was average. The service provided met basic expectations. ' +
      "With enhancements to communication, WebWise could offer an improved experience for its customers.",
    rating: "★★★☆☆",
    pfp: facebook,
    share: share,
  },
  {
    author: "Wilston Franz",
    title: "Share Me!",
    date: "review from xxx (xx.xx.xxxx)",
    feedback:
      "A truly customer-centric approach sets WebWise apart. " +
      'The team was attentive to our needs, responsive to inquiries, and ensured our satisfaction throughout. A pleasure to work with and highly recommended."',
    rating: "★★★★★",
    pfp: facebook,
    share: share,
  },
  {
    author: "Sophia Gulgovzska",
    title: "Share Me!",
    date: "review from xxx (xx.xx.xxxx)",
    feedback:
      '"Our experience with WebWise was generally satisfactory. However, a few revisions were needed. ' +
      'The service met our expectations, but addressing these issues would enhance the overall customer experience."',
    rating: "★★★★☆",
    pfp: facebook,
    share: share,
  },
];

const Components = [
  {
    title: "SCD41 Sensor",
    info:
      "The SCD41 is a compact CO2 sensor that uses non-dispersive infrared (NDIR) technology, " +
      "measuring carbon dioxide levels from 400 to 10,000 ppm with an accuracy of ±30 ppm + 3% of reading. " +
      "It includes integrated temperature and humidity sensing for compensation and operates with low power, " +
      "making it ideal for battery-operated applications such as indoor air quality monitoring and HVAC systems.",
    url: "https://sensirion.com/media/documents/48C4B7FB/64C134E7/Sensirion_SCD4x_Datasheet.pdf",
    image: scd41,
  },
  {
    title: "BME280 Sensor",
    info:
      "The BME280 is a versatile sensor that measures temperature, humidity, and pressure. " +
      "It operates from -40 to +85 °C for temperature and 0 to 100% RH for humidity, " +
      "with pressure measurements between 300 to 1100 hPa. The sensor supports I2C and SPI interfaces, " +
      "making it ideal for weather stations and environmental monitoring projects.",
    url: "https://cdn-learn.adafruit.com/downloads/pdf/adafruit-bme280-humidity-barometric-pressure-temperature-sensor-breakout.pdf",
    image: bme280,
  },
  {
    title: "VEML7700 Sensor",
    info: "The VEML7700 is a light intensity sensor that measures ambient light from 0.003 to 100,000 lux, " +
    "suitable for both indoor and outdoor use. It includes integrated UV and infrared sensing capabilities " +
    "and communicates via I2C, making it perfect for applications " +
    "like automatic brightness adjustment in displays and energy-efficient lighting systems.",
    url: "https://cdn-learn.adafruit.com/downloads/pdf/adafruit-veml7700.pdf",
    image: veml7700,
  },
  {
    title: "SPS30 Sensor",
    info: "The SPS30 is a particulate matter sensor that detects particles in the range of 0.3 to 10 µm, " +
    "including PM1, PM2.5, and PM10. It features laser scattering technology with an accuracy of ±10% for PM2.5 at 100 µg/m³. " +
    "The sensor has a self-cleaning mechanism and supports I2C and UART communication, " +
    "making it suitable for air quality monitoring and industrial applications.",
    url: "https://cdn.soselectronic.com/productdata/0c/0f/243ffc55/sps30-2.pdf",
    image: sps30,
  },
  {
    title: "SHT35 Sensor",
    info: "The SHT35 is an accurate temperature and humidity sensor with a range of -40 to +125 °C for temperature " +
    "and 0 to 100% RH for humidity. It offers high precision, with an accuracy of ±0.1 °C and ±1.5% RH. " +
    "Compact and energy-efficient, it is well-suited for applications like home automation, " +
    "weather stations, and HVAC controls.",
    url: "https://sensirion.com/media/documents/213E6A3B/63A5A569/Datasheet_SHT3x_DIS.pdf",
    image: sht35,
  },
  {
    title: "ESP32-WROOM-32",
    info: "The ESP32-WROOM-32 is a powerful microcontroller that integrates Wi-Fi and Bluetooth capabilities. " +
    "It features a dual-core processor for multitasking and supports various communication protocols, " +
    "including I2C, SPI, and UART. With low power consumption and versatility, " +
    "it's widely used in IoT projects, home automation, and environmental monitoring applications.",
    url: "https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf",
    image: esp32_wroom_32,
  },
];

const Contact = [
  {
    address: "Križovatka, 969 01 Banská Štiavnica",
    phone: "+421 915 213 000",
    gmail: "jakub.project@spsjm.eu",
  },
];

const services = [
  {
    title: "Repair and replacement of parts",
    content:
      "Various repairs, from minor adjustments to replacement of key parts",
    icon: RAROP,
    date: [" Monday - Friday", " -> ", "8:00 - 18:00 "],
    points: [
      "Precise adjustments and fine settings for optimum performance",
      "Replacement of parts with emphasis on key components to ensure long-term reliability",
      " Other adjustments including specific repairs and parts available upon request",
    ],
  },
  {
    title: "Diagnostics and Technical Analysis",
    content:
      "Thorough diagnostics and technical analysis of the components and their condition",
    icon: DATA,
    date: [" Monday - Saturday", " -> ", "6:00 - 20:00 "],
    points: [
      "Systematic analysis of the technical condition with identification of potential problems",
      "Detailed diagnostics and precise functional verification",
      "Supplementary information on diagnostic processes and technical analysis, including available services and specifications",
    ],
  },
  {
    title: "Preventive maintenance/ inspection",
    content:
      "Regular maintenance and inspection of the components to prevent possible breakdowns",
    icon: PMI,
    date: [" Monday - Friday", " -> ", "8:00 - 18:00 "],
    points: [
      "Precision maintenance with a focus on preventing problems and maintaining optimum functionality",
      "Thorough inspection of individual components to prevent potential failures and ensure long-term reliability",
      "Further information on preventive maintenance and inspections for optimal maintenance planning of your equipment",
    ],
  },
  {
    title: "Training and consultancy",
    content:
      "training for technicians and engineers, advice on the optimum set-up and use of the components",
    icon: TAC,
    date: [" Monday - Saturday", " -> ", "6:00 - 22:00 "],
    points: [
      "Specialised training for technicians and engineers to improve their skills and knowledge",
      "Advice on the optimal set-up and efficient use of individual components",
      "Additional information on training and consultancy, including available services and details on the optimal use of components",
    ],
  },
];

const skillBall = [
  {
    name: "Programming",
    icon: A,
  },
  {
    name: "Programming",
    icon: U,
  },
  {
    name: "Programming",
    icon: T,
  },
  {
    name: "Programming",
    icon: O,
  },
  {
    name: "Programming",
    icon: M,
  },
  {
    name: "Programming",
    icon: A,
  },
  {
    name: "Programming",
    icon: T,
  },
  {
    name: "Programming",
    icon: I,
  },
  {
    name: "Programming",
    icon: O,
  },
  {
    name: "Programming",
    icon: N,
  },
  {
    name: "Programming",
    icon: plus,
  },
];

const contactTutorial = [
  {
    title: "Step 1",
    img: "",
    info:
      "Contact us on our social medias (Instagram, Facebook, Discord), " +
      "send us an email or call us on our phone number. ",
    additionalInfo:
      "If you have any questions, comments or need help, contacting us is easy.",
  },
  {
    title: "Step 2",
    img: "",
    info:
      "That's it. Our team will get back to you as soon as possible " +
      "and is ready to answer your questions and help you with anything we can. ",
    additionalInfo:
      "We look forward to helping you and answering your questions.",
  },
];

const experiences = [
  {
    title: "Address",
    content: "Križovatka, 969 01 Banská Štiavnica",
    icon: address,
    date: [" Monday - Friday", " -> ", "8:00 - 18:00 "],
    points: [
      "You can visit us in person at our address, " +
        "where we will warmly welcome you and provide you with all the necessary assistance",
      "Our working hours are Monday to Friday from 8:00 to 18:00, " +
        "In the off-hours you can leave us a message and we will get back to you as soon as possible",
    ],
  },
  {
    title: "Phone",
    content: "+421 915 213 000",
    icon: phone,
    date: [" Monday - Sunday", " -> ", "8:00 - 20:00 "],
    points: [
      "If you have any questions or need immediate assistance, feel free to call, " +
        "text or WhatsApp us. We look forward to hearing from you",
      "You can contact us via our phone number anytime " +
        "from Monday to Sunday from 8:00 to 20:00",
    ],
  },
  {
    title: "E-mail",
    content: "help.webwise@gmail.com",
    icon: email,
    date: [" anytime", "  ", "24/7 "],
    points: [
      "If you have any questions, comments or need further information, " +
        "please do not hesitate to write to us at our email address",
      "Our team is ready to answer your questions and provide you with " +
        "the support you need. We look forward to communicating with you via email",
    ],
  },
];

const contactBall = [
  {
    name: "Phone",
    icon: phoneBall,
  },
  {
    name: "Facebook",
    icon: facebook,
  },
  {
    name: "Instagram",
    icon: instagram,
  },
  {
    name: "Discord",
    icon: discord,
  },
  {
    name: "Email",
    icon: emailBall,
  },
];

const projects = [
  {
    name: "Buy",
    title: "Buy components",
    description: [
      "browse our range of sensors and microcontrollers",
      "enjoy competitive pricing and fast delivery",
      "choose from complete kits or individual parts",
      "get expert advice for optimal selection",
      "benefit from warranty and support services",
    ],
    image: buy,
  },
  {
    name: "Connect",
    title: "Connect account",
    description: [
      "sign up for an account on our platform",
      "verify your email to activate features",
      "link devices to your account",
      "ensure a secure internet connection",
      "access an easy-to-use dashboard",
    ],
    image: connect,
  },
  {
    name: "Set_up",
    title: "Set up sensors",
    description: [
      "follow provided installation guides",
      "install sensors in optimal locations",
      "if needed calibrate for accurate readings",
      "connect and power up your sensors",
      "test setup with our troubleshooting tips",
    ],
    image: set_up,
  },
  {
    name: "Monitor",
    title: "Monitor data",
    description: [
      "view real-time data on our platform",
      "set customizable alerts for changes",
      "analyze historical trends",
      "adjust settings for accuracy",
      "share insights with stakeholders easily",
    ],
    image: monitor,
  },
];

export {
  navLinks,
  account,
  SectionsByPage,
  socialMedias,
  Feedbacks,
  Components,
  Contact,
  services,
  skillBall,
  contactTutorial,
  experiences,
  contactBall,
  projects,
};
