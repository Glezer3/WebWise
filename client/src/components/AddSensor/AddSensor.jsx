import { useState, useRef } from "react";
import { SectionWrapper } from "../../HighOrderComponents";
import { useSelector } from "react-redux";
import { StarsCanvas } from "../canvas";
import "./AddSensor.css";

const AddSensor = () => {
    const [ waititng, setWaiting ] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);

    const [form, setForm] = useState({
        sensorName: "",
        sensorId: "",
      });

    const formRef = useRef();

    const handleLabelPosition = (e) => {
        const { name, value } = e.target;
        setForm({
          ...form,
          [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      try {
        setWaiting(true);
        const res = await fetch(`/api/user/sensor/add_sensor/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success === false) {
        setWaiting(false);
        setError(data.message)
          return;
        }

        setWaiting(false);
        setError("sensor successfully added");
        setForm({
            sensorName: "",
            sensorId: "",
        })

    } catch (error) {
        console.log(error)
      }
    };

    const handleSensorName = (e) => {
        if (!/[a-zA-Z0-9-/#@+_:,.]/.test(e.key)) e.preventDefault();
    };

    const handleSensorId = (e) => {
        if (!/[a-zA-Z0-9#:]/.test(e.key)) e.preventDefault();
    };

    const getLabelStyle = (inputName) => (
        form[inputName] ? { top: "-23%" } : {}
    )

    return (
        <div id="addSensorHolder">
            <div id="addSensorShape">
            <p id="headSubtext">got a new sensor?</p>
            <h1 id="headTitle">Add Sensor</h1>

            <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    method="POST"
                    autoComplete="on"
                    id="form"
                >

            <span className="userInput" id="holderSensorName">
              <input
                name="sensorName"
                type="text"
                id="name"
                minLength={3}
                maxLength={15}
                autoComplete="text"
                value={form.sensorName}
                onKeyDown={(e) => handleSensorName(e)}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="sensorName" style={getLabelStyle('sensorName')}>Name</label>
              <div className="underline"></div>
            </span>
            
            <span className="userInput" id="holderSensorId">
              <input
                name="sensorId"
                type="text"
                id="sensorId"
                minLength={1}
                maxLength={15}
                autoComplete="text"
                value={form.sensorId}
                onKeyDown={(e) => handleSensorId(e)}
                onChange={handleLabelPosition}
                readOnly={waititng ? true : false}
                required
              />
              <label htmlFor="sensorId" style={getLabelStyle('sensorId')}>Sensor ID</label>
              <div className="underline"></div>
            </span>
            <div id="errorHolder">{error}</div>
            <button type="submit" className="button" id="forgotPasswordButton" style={waititng ? {pointerEvents: "none"} : {pointerEvents: "all"}}>{waititng ? 'Adding Sensor...' : 'Add Sensor'}</button>
                </form>
            </div>
            <StarsCanvas />
        </div>
    )
}

export default SectionWrapper(AddSensor, "addsensor")