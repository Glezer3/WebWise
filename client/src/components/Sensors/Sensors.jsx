import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./Sensors.css";
import { StarsCanvas } from "../canvas";
import { edit } from "../../assets";
import { SectionWrapper } from "../../HighOrderComponents";

const Sensors = () => {
    const [sensors, setSensors] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [progressPerc, setProgressPerc] = useState({});
    const [fileUploadError, setFileUploadError] = useState(false);
    const [showDeleteModule, setShowDeleteModule] = useState(null);  // Show only for specific sensor
    const [editingSensorId, setEditingSensorId] = useState(null);
    const [formDatas, setFormDatas] = useState({});
    const [updateMessages, setUpdateMessages] = useState({});
    const fileRefs = useRef({});

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const res = await fetch(`/api/user/sensors/${currentUser._id}`);
                if (!res.ok) {
                    if (res.status === 500) navigate('/unknown', { replace: true });
                }
                const data = await res.json();
                const initialFormDatas = {};
                data.forEach((sensor) => {
                    initialFormDatas[sensor._id] = { photo: sensor.photo, name: sensor.name };
                });
                setFormDatas(initialFormDatas);
                setSensors(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSensors();
    }, [currentUser._id, navigate]);

    const handleFileUpload = (file, sensorId) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgressPerc((prevProgress) => ({ ...prevProgress, [sensorId]: Math.round(progress) }));
            },
            (error) => {
                setFileUploadError(true);
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormDatas((prevFormDatas) => ({
                        ...prevFormDatas,
                        [sensorId]: { ...prevFormDatas[sensorId], photo: downloadURL },
                    }))
                );
            }
        );
    };

    const handleUpdate = (sensorId) => {
        setEditingSensorId(sensorId === editingSensorId ? null : sensorId);
    };

    const handleShowDeleteModule = (sensorId) => {
        setShowDeleteModule(sensorId);  // Show module for specific sensor
    };

    const handleHideDeleteModule = () => {
        setShowDeleteModule(null);  // Hide module
    };

    const handleCardClick = (sensorId) => {
        if (editingSensorId === null) {
            navigate(`/sensors/${currentUser._id}/${sensorId}`);
        }
    };

    const handleImageClick = (sensorId) => {
        if (editingSensorId === sensorId) {
            fileRefs.current[sensorId].click();
        }
    };

    const handleChange = (e, sensorId) => {
        setFormDatas((prevFormDatas) => ({
            ...prevFormDatas,
            [sensorId]: { ...prevFormDatas[sensorId], [e.target.name]: e.target.value },
        }));
    };

    const handleSensorName = (e) => {
        if (!/[a-zA-Z0-9-/#@+_:,.]/.test(e.key)) e.preventDefault();
    };

    const handleSubmit = async (e, sensorId) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/user/updateSensor/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formDatas[sensorId], sensorId }),
            });
            const data = await res.json();
            if (data.success === false) {
                setUpdateMessages((prevMessages) => ({
                    ...prevMessages,
                    [sensorId]: "An error occurred",
                }));
            } else {
                setUpdateMessages((prevMessages) => ({
                    ...prevMessages,
                    [sensorId]: "Successfully updated",
                }));
                setEditingSensorId(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (sensorId) => {
        try {
            const res = await fetch(`/api/user/deleteSensor/${currentUser._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sensorId: sensorId }),
            });
    
            const data = await res.json();
            if (data.success) {
                setSensors((prevSensors) => prevSensors.filter(sensor => sensor._id !== sensorId));
                setUpdateMessages((prevMessages) => ({
                    ...prevMessages,
                    [sensorId]: "Successfully deleted",
                }));
                handleHideDeleteModule();
            } else {
                setUpdateMessages((prevMessages) => ({
                    ...prevMessages,
                    [sensorId]: data.message,
                }));
            }
        } catch (error) {
            setUpdateMessages((prevMessages) => ({
                ...prevMessages,
                [sensorId]: "An error occurred during deletion",
            }));
        }
    };

    return (
        <section id="sensorsHolder">
            <div id="sensorTitle">Your Sensors</div>
            <div id="sensorShape">
                {sensors.map((sensor) => (
                    <div 
                        key={sensor._id} 
                        id="sensorCard" 
                        className={`sensorCard ${editingSensorId === sensor._id ? "editing" : ""}`}
                        onClick={() => handleCardClick(sensor._id)}
                    >
                        <form onSubmit={(e) => handleSubmit(e, sensor._id)} id="sensorsForm">
                            <div className="sensorCardImg">
                                <input
                                    name="photo"
                                    type="file"
                                    onChange={(e) => handleFileUpload(e.target.files[0], sensor._id)}
                                    ref={(ref) => (fileRefs.current[sensor._id] = ref)}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                />
                                <img
                                    className="img"
                                    src={formDatas[sensor._id]?.photo || sensor.photo}
                                    alt="sensor"
                                    onClick={() => handleImageClick(sensor._id)}
                                    style={editingSensorId === sensor._id ? { cursor: "pointer" } : { pointerEvents: "none" }}
                                />
                                <img
                                    src={edit}
                                    onClick={(e) => { e.stopPropagation(); handleUpdate(sensor._id); }}
                                    alt="edit"
                                    className="edit"
                                />
                            </div>
                            <div className="sensorCardInfo">
                                <label htmlFor="Status">ID:</label>
                                <div name="Status">{sensor.sensorId}</div>
                            </div>
                            <div className="sensorCardInfo">
                                <label htmlFor="name">Name:</label>
                                <input
                                    name="name"
                                    type="text"
                                    minLength={3}
                                    maxLength={15}
                                    defaultValue={formDatas[sensor._id]?.name || sensor.name}
                                    onChange={(e) => handleChange(e, sensor._id)}
                                    onKeyDown={(e) => handleSensorName(e)}
                                    style={editingSensorId === sensor._id ? { pointerEvents: "all" } : { pointerEvents: "none" }}
                                />
                            </div>
                            <div className="sensorCardInfo">
                                <label htmlFor="Status">Status:</label>
                                <div name="Status">{sensor.status}</div>
                            </div>
                            <div id="errorHolder" style={{ marginTop: "1rem"}}>
                                {updateMessages[sensor._id] || null}
                            </div>
                            <div id="progressHolder">
                                {progressPerc[sensor._id] > 0 && progressPerc[sensor._id] < 100 ? `${progressPerc[sensor._id]}%` : null}
                            </div>
                            <div className="buttonHolder">
                                <button
                                    type="submit"
                                    id="sensorSubmit"
                                    className="button"
                                    style={editingSensorId === sensor._id ? { display: "block" } : { display: "none" }}
                                >
                                    Update
                                </button>
                                <div
                                    id="sensorDelete"
                                    className="button"
                                    style={editingSensorId === sensor._id ? { display: "block" } : { display: "none" }}
                                    onClick={() => handleShowDeleteModule(sensor._id)}
                                >
                                    Delete
                                </div>
                                <div
                                    id="confirmChangeHolder"
                                    style={showDeleteModule === sensor._id ? { display: "block" } : { display: "none" }}
                                >
                                    <div id="confirmChangeShape">
                                        <h1>Are you sure you want to Delete your sensor: <span id="sensorsQuestionModule">{sensor.sensorId}</span> ?</h1>
                                        <div id="confirmChange">
                                            <button
                                                onClick={() => {
                                                    handleDelete(sensor._id);
                                                }}
                                                className="button"
                                            >
                                                Delete
                                            </button>
                                            <span onClick={handleHideDeleteModule} className="button">
                                                Cancel
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ))}
                <a id="addSensor" className="button" href={`add_sensor/${currentUser._id}`}>Add Sensor</a>
            </div>
            <StarsCanvas />
        </section>
    );
};

export default SectionWrapper(Sensors, "sensors");
