import Form from "./ContactForm"
import ContactOverview from "./ContactOverview"
import Footer from "../Footer/Footer"

const Contact = () => {
    return (
        <div>
            <div>
                <ContactOverview />
            </div>
                <Form />
                <Footer />
        </div>
    )
}

export default Contact