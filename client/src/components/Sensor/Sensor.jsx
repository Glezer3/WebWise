import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { Chart } from "chart.js/auto";
import { online, offline, simple_mode, advanced_mode } from "../../assets";
import { SectionWrapper } from "../../HighOrderComponents";
import "swiper/swiper-bundle.css";
import "./Sensor.css";

const Sensor = () => {
  const getCurrentTime = () => {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
  };

  const { id, sensorID } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [sensorOwner, setSensorOwner] = useState(null);
  const [sensor, setSensor] = useState({});
  const [mode, setMode] = useState("simple");
  const [sensorHistory, setSensorHistory] = useState({});
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [fetchingData, setFetchingData] = useState(true);
  const [showAllHistory, setShowAllHistory] = useState({});
  const [displayedValues, setDisplayedValues] = useState({});
  const [loadedNotifications, setLoadedNotifications] = useState({});
  const [displayedNotifications, setDisplayedNotifications] = useState({});
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);
  const [moreInfoData, setMoreInfoData] = useState({});
  const [time, setTime] = useState(getCurrentTime());
  const [alertState, setAlertState] = useState({
    carbon_monoxide: { timestamp: null, lastValue: null },
    temperature: { timestamp: null, lastValue: null },
    humidity: { timestamp: null, lastValue: null },
  });
  const [lastFetchedValues, setLastFetchedValues] = useState({
    carbon_monoxide: null,
    temperature: null,
    humidity: null,
  });

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "simple" ? "advanced" : "simple"));
  };

  const sensorParameters = useMemo(
    () => ({
      carbon_monoxide: {
        range: [0, 5000],
        safeRange: [0, 1100],
        unit: "ppm",
        stepSize: 500,
      },
      temperature: {
        range: [-60, 120],
        safeRange: [15, 25],
        unit: "°C",
        stepSize: 18,
      },
      humidity: {
        range: [0, 100],
        safeRange: [30, 50],
        unit: "%",
        stepSize: 10,
      },
      atmospheric_pressure: {
        range: [0, 3000],
        safeRange: [900, 1100],
        unit: "hPa",
        stepSize: 300,
      },
      typical_particle_size: {
        range: [0, 10],
        safeRange: [0, 10],
        unit: "µm",
        stepSize: 1,
      },
      light_intensity: {
        range: [0, 1000],
        safeRange: [0, 1000],
        unit: "lux",
        stepSize: 100,
      },
      light_rawALS: {
        range: [0, 1000],
        safeRange: [0, 1000],
        unit: "",
        stepSize: 100,
      },
      light_rawWhite: {
        range: [0, 1000],
        safeRange: [0, 1000],
        unit: "",
        stepSize: 100,
      },
      PM1_0: {
        range: [0, 100],
        safeRange: [0, 15],
        unit: "µg/m³",
        stepSize: 10,
      },
      PM2_5: {
        range: [0, 100],
        safeRange: [0, 12],
        unit: "µg/m³",
        stepSize: 10,
      },
      PM4_0: {
        range: [0, 100],
        safeRange: [0, 20],
        unit: "µg/m³",
        stepSize: 10,
      },
      PM10_0: {
        range: [0, 100],
        safeRange: [0, 54],
        unit: "µg/m³",
        stepSize: 10,
      },
      NC0_5: {
        range: [0, 500],
        safeRange: [0, 200],
        unit: "particle/cm³",
        stepSize: 50,
      },
      NC1_0: {
        range: [0, 500],
        safeRange: [0, 200],
        unit: "particle/cm³",
        stepSize: 50,
      },
      NC2_5: {
        range: [0, 500],
        safeRange: [0, 200],
        unit: "particle/cm³",
        stepSize: 50,
      },
      NC4_0: {
        range: [0, 500],
        safeRange: [0, 200],
        unit: "particle/cm³",
        stepSize: 50,
      },
      NC10_0: {
        range: [0, 500],
        safeRange: [0, 200],
        unit: "particle/cm³",
        stepSize: 50,
      },
    }),
    []
  );

  const sensorSelectedValues = useMemo(
    () =>
      mode === "simple"
        ? Object.keys(sensorParameters).slice(0, 6)
        : Object.keys(sensorParameters),
    [mode, sensorParameters]
  );

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const res = await fetch(`/api/user/sensors/${id}/${sensorID}`);
        if (!res.ok) {
          if (res.status === 500) navigate("/unknown", { replace: true });
        }
        const data = await res.json();
        setSensor(data);
        setSensorHistory(data);
        setSensorOwner(data.userId);
        const defaultValues = {};
        sensorSelectedValues.forEach((key) => {
          defaultValues[key] = getValueFromSensor(data, key) || 10;
        });
        setDisplayedValues(defaultValues);

        const co2Level = data.carbon_monoxide;
      const temperatureLevel = data.temperature;
      const humidityLevel = data.humidity;

      const now = Date.now();

      if (
        lastFetchedValues.carbon_monoxide === co2Level &&
        lastFetchedValues.temperature === temperatureLevel &&
        lastFetchedValues.humidity === humidityLevel
      ) {
        setFetchingData(false);
        return;
      }

      setLastFetchedValues({
        carbon_monoxide: co2Level,
        temperature: temperatureLevel,
        humidity: humidityLevel,
      });

      const isOutOfRange = (value, min, max) => {
        const minThreshold = min - min * 0.15;
        const maxThreshold = max + max * 0.15;
        return value < minThreshold || value > maxThreshold;
      };

      const alertsToSend = [];

      const checkAndSendAlert = async (parameter, level, safeRangeKey) => {
        const safeRange = sensorParameters[safeRangeKey].safeRange;
        const alertInterval = 30 * 60 * 1000;
        const significantIncreaseThreshold = 0.15;

        const { timestamp, lastValue } = alertState[safeRangeKey];

        if (isOutOfRange(level, safeRange[0], safeRange[1])) {
          if (
            !timestamp ||
            now - timestamp >= alertInterval ||
            Math.abs(level - lastValue) > significantIncreaseThreshold * Math.abs(lastValue)
          ) {
            alertsToSend.push({
              parameter,
              value: level,
              safeRange,
            });

            setAlertState((prev) => ({
              ...prev,
              [safeRangeKey]: { timestamp: now, lastValue: level },
            }));
          }
        } else {
          if (timestamp) {
            setAlertState((prev) => ({
              ...prev,
              [safeRangeKey]: { timestamp: null, lastValue: null },
            }));
          }
        }
      };

      await checkAndSendAlert("CO2", co2Level, "carbon_monoxide");
      await checkAndSendAlert("Temperature", temperatureLevel, "temperature");
      await checkAndSendAlert("Humidity", humidityLevel, "humidity");

      if (alertsToSend.length > 0) {
        await sendAlert(currentUser.email, alertsToSend);
      }

      setFetchingData(false);

      } catch (error) {
        console.log(error);
      }
    };

    fetchSensor();

    const intervalId = setInterval(fetchSensor, 6100);

    return () => clearInterval(intervalId);
  }, [id, sensorID, navigate, sensorSelectedValues, currentUser.email, sensorParameters, alertState, lastFetchedValues]);

  useEffect(() => {
    if (currentUser && sensorOwner && currentUser._id !== sensorOwner)
      navigate("/unknown", { replace: true });
  }, [currentUser, sensorOwner, navigate]);

  useEffect(() => {
    const defaultDisplayedValues = {};
    const defaultNotificationsCount = {};
    const defaultLoadedNotification = {};

    sensorSelectedValues.forEach((key) => {
      defaultDisplayedValues[key] = 10;
      defaultNotificationsCount[key] = 20;
      defaultLoadedNotification[key] = 0;
    });

    setDisplayedValues(defaultDisplayedValues);
    setDisplayedNotifications(defaultNotificationsCount);
    setLoadedNotifications(defaultLoadedNotification);
  }, [sensorSelectedValues]);

  const sendAlert = async (email, alerts) => {
    try {
      await fetch("/api/sensor/sensor-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, alerts }),
      });
    } catch (error) {
      console.error("Error sending alert:", error);
    }
  };

  const getValueFromSensor = (sensor, key) => {
    if (key.startsWith("PM")) return sensor.particulate_matter?.[key];
    else if (key.startsWith("NC")) return sensor.number_concentration?.[key];
    else if (key.startsWith("light")) {
      const keyParts = key.split("_")[1];
      return sensor.light?.[keyParts];
    } else return sensor[key];
  };

  const getHistoryValueFromSensor = (snapshot, key) => {
    if (key.startsWith("PM")) return snapshot.particulate_matter?.values?.[key];
    else if (key.startsWith("NC"))
      return snapshot.number_concentration?.values?.[key];
    else if (key.startsWith("light")) {
      const keyPart = key.split("_")[1];
      return snapshot.light?.values?.[keyPart];
    } else return snapshot[key];
  };

  const replaceKey = (key) => {
    if (key.startsWith("PM") || key.startsWith("NC"))
      return key.replace(/_/g, ".").replace(/(PM|NC)(?=\S)/g, "$1 ");
    else return key.replace(/_/g, " ").replace(/raw/g, "raw ");
  };

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const currentTime = getCurrentTime();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const handleSlidesPerView = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 1200) {
      return 1;
    } else if (screenWidth < 1500) {
      return 2;
    } else if (screenWidth < 1800) {
      return 3;
    } else {
      return 4;
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

  const handleSensorActivity = async () => {
    try {
      const res = await fetch(`/api/user/sensors/${id}/${sensorID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: sensor.status === "active" ? "inactive" : "active",
        }),
      });

      if (!res.ok) {
        if (res.status === 500) navigate("/unknown", { replace: true });
      }
      const data = await res.json();
      setSensor(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowAllHistory = (key) => {
    setShowAllHistory((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLoadMoreNotifications = (key) => {
    setLoadingNotifications(true);
    setTimeout(() => {
      setLoadedNotifications((prevCounts) => ({
        ...prevCounts,
        [key]: (prevCounts[key] || 20) + 10,
      }));
      setLoadingNotifications(false);
    }, 1000);
  };

  const handleShowMoreInfo = (sensorData, key) => {
    const dataToShow = { [key]: getHistoryValueFromSensor(sensorData, key) };
    setMoreInfoData(dataToShow);
    setMoreInfo(true);
    document.body.classList.add("disabled-scrolling");
  };

  const closeMoreInfo = () => {
    setMoreInfo(false);
    document.body.classList.remove("disabled-scrolling");
  };

  const graphColor = useCallback(
    (actualValue, key) => {
      const {
        range: [min, max],
        safeRange,
      } = sensorParameters[key];
      const [safeMin, safeMax] = safeRange || [min, max];

      const safeMinThreshold = safeMin - safeMin * 0.1;
      const safeMaxThreshold = safeMax + safeMax * 0.1;

      if (actualValue >= safeMin && actualValue <= safeMax) {
        return "#01a437";
      } else if (
        (actualValue < safeMin && actualValue >= safeMinThreshold) ||
        (actualValue > safeMax && actualValue <= safeMaxThreshold)
      ) {
        return "#FFA500";
      } else {
        return "#FF0000";
      }
    },
    [sensorParameters]
  );

  window.addEventListener("DOMContentLoaded", () => {
    const notificationMoreInfo = document.querySelector(
      ".notificationMoreInfo"
    );
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const translateX = (screenWidth - notificationMoreInfo.offsetWidth) / 2;
    const translateY = (screenHeight - notificationMoreInfo.offsetHeight) / 2;

    notificationMoreInfo.style.transform = `translate(${translateX}px, ${translateY}px)`;
  });

  useEffect(() => {
    const createOrUpdateDonutChart = (elementId, value, key) => {
      const ctx = document.getElementById(elementId);
      const {
        range: [, max],
        unit,
      } = sensorParameters[key];

      if (!ctx || !Chart.getChart(ctx)) {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: [replaceKey(key)],
            datasets: [
              {
                data: [value, max - value],
                backgroundColor: [graphColor(value, key), "#161b22"],
                borderWidth: 0,
                label: key,
              },
            ],
          },
          options: {
            cutout: "75%",
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: function (context) {
                    const normalizedLabel = replaceKey(key);
                    if (context.label !== normalizedLabel) {
                      return null;
                    }
                    const formattedValue = Math.round(context.raw * 100) / 100;
                    return `${normalizedLabel}: ${formattedValue}`; //${sensorSelectedValuesRanges[sensorSelectedValues.indexOf(key)][2]}
                  },
                },
              },
            },
          },
        });
      } else {
        const chart = Chart.getChart(ctx);
        chart.data.labels = [key];
        chart.data.datasets[0].data = [value, max - value];
        chart.data.datasets[0].backgroundColor = [
          graphColor(value, key),
          "#161b22",
        ];
        chart.update();
      }
    };

    sensorSelectedValues.forEach((key) => {
      const elementId = `${key}Chart`;
      const value = getValueFromSensor(sensor, key);

      if (document.getElementById(elementId) && value !== undefined) {
        createOrUpdateDonutChart(elementId, value, key);
      }
    });

    return () => {
      sensorSelectedValues.forEach((key) => {
        const elementId = `${key}Chart`;
        const ctx = document.getElementById(elementId);
        if (ctx && Chart.getChart(ctx)) {
          Chart.getChart(ctx).destroy();
        }
      });
    };
  }, [sensor, sensorSelectedValues, graphColor, sensorParameters]);

  useEffect(() => {
    const createLineChart = (elementId, timestamps, values, key) => {
      const ctx = document.getElementById(elementId);
      const isShowingAll = showAllHistory[key] || false;
      const displayedTimestamps = isShowingAll
        ? timestamps
        : timestamps.slice(-10);
      const displayedValuesArray = isShowingAll ? values : values.slice(-10);
      const {
        range: [min, max],
        unit,
        stepSize,
      } = sensorParameters[key];
      const xAxisTimestamps = displayedTimestamps.map((timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}`;
      });

      if (ctx && Chart.getChart(ctx)) {
        const chart = Chart.getChart(ctx);
        chart.data.labels = displayedTimestamps.map((timestamp) => {
          const date = new Date(timestamp);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        });
        chart.data.datasets[0].data = displayedValuesArray;
        chart.options.scales.x.ticks.callback = function (index) {
          return xAxisTimestamps[index];
        };
        chart.data.datasets[0].borderColor = graphColor(
          displayedValuesArray.slice(-1)[0],
          key
        );
        chart.update();
      } else {
        const hoverTimestamps = displayedTimestamps.map((timestamp) => {
          const date = new Date(timestamp);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        });
        new Chart(ctx, {
          type: "line",
          data: {
            labels: hoverTimestamps,
            datasets: [
              {
                label: replaceKey(key),
                data: displayedValuesArray,
                borderColor: graphColor(displayedValuesArray.slice(-1)[0], key),
                backgroundColor: "transparent",
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "x",
            },
            scales: {
              x: {
                ticks: {
                  maxTicksLimit: 20,
                  callback: function (index) {
                    return xAxisTimestamps[index];
                  },
                  padding: 5,
                },
              },
              y: {
                min: min,
                max: max,
                ticks: {
                  stepSize: stepSize,
                  maxTicksLimit: 10,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: "nearest",
              },
            },
          },
        });
      }
    };

    sensorSelectedValues.forEach((key) => {
      const elementId = `${key}LineChart`;
      if (document.getElementById(elementId)) {
        const timestamps = sensorHistory.dataHistory.map(
          (snapshot) => snapshot.timestamp
        );
        const values = sensorHistory.dataHistory.map((snapshot) =>
          getHistoryValueFromSensor(snapshot, key)
        );
        createLineChart(elementId, timestamps, values, key);
      }
    });
  }, [
    sensorHistory,
    sensorSelectedValues,
    sensorParameters,
    sensorID,
    displayedValues,
    showAllHistory,
    graphColor,
  ]);

  if (!sensor) {
    return <div>Loading...</div>;
  }

  return (
    <section id="sensorHolder">
      <section id="sensorInfoHolder">
        <div className="sensorInfo" id="sensorInfoG">
          <div id="sensorName">{sensor.name}</div>
          <div id="sensorStatusHolder">
            <div id="status1">
              <div id="sensorStatus">Sensor {sensor.sensorId}</div>
              <div id="sensorProvider">Sensor mode</div>
            </div>
            <div
              id="status2"
              style={
                sensor.status === "active"
                  ? { color: "#90EE90" }
                  : { color: "#EE2400" }
              }
            >
              {sensor.status}
              <div id="sensorMode">
                {mode === "simple" ? "simple" : "advanced"}
              </div>
            </div>
          </div>
          <div id="sensorInfoImg">
            <img
              src={sensor.status === "active" ? offline : online}
              alt={sensor.status === "active" ? "offline" : "online"}
              onClick={handleSensorActivity}
            />
            <img
              src={mode === "simple" ? advanced_mode : simple_mode}
              alt={mode === "simple" ? "simple mode" : "advanced mode"}
              style={
                sensor.status === "active"
                  ? { display: "block" }
                  : { display: "none" }
              }
              onClick={toggleMode}
            />
          </div>
          <div id="sensorStatement">
            actual sensor values {mode === "simple" ? "SIMPLE" : "ADVANCED"}{" "}
            mode
          </div>
        </div>
        <div className="sensorInfo" id="sensorInfoR">
          <Swiper
            modules={[
              Navigation,
              Pagination,
              Scrollbar,
              A11y,
              Autoplay,
              EffectCoverflow,
            ]}
            spaceBetween={40}
            slidesPerView={slidesPerView}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSlideChange={() => ""}
            onSwiper={() => ""}
          >
            {sensorSelectedValues.map((key, index) => (
              <SwiperSlide key={index}>
                {sensor.status === "active" ? (
                  <>
                    <canvas
                      id={`${key}Chart`}
                      className="sensorGraph"
                      style={{ display: "block" }}
                    ></canvas>
                    <div className="sensorValueDanger">
                      <div className="sensorValue">
                        {Math.round(getValueFromSensor(sensor, key) * 100) /
                          100 +
                          " " +
                          sensorParameters[key].unit}
                      </div>
                      <div
                        className="sensorDanger"
                        style={
                          graphColor(getValueFromSensor(sensor, key), key) ===
                          "#FFA500"
                            ? { color: "#FFA500" }
                            : { color: "#FF0000" }
                        }
                      >
                        {graphColor(getValueFromSensor(sensor, key), key) ===
                        "#01a437"
                          ? null
                          : graphColor(getValueFromSensor(sensor, key), key) ===
                            "#FFA500"
                          ? "!"
                          : "!!!"}
                      </div>
                    </div>
                    <div className="sensorValueKey">{replaceKey(key)}</div>
                  </>
                ) : null}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section id="sensorGraphHolder">
        <Swiper
          modules={[EffectCoverflow]}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          onSlideChange={() => ""}
          onSwiper={() => ""}
        >
          {sensorSelectedValues.map((key, index) => (
            <SwiperSlide key={index}>
              {sensor.status === "active" ? (
                <div className="sensorFullGraph">
                  <div className="optionHolder">
                    <h3>{replaceKey(key)}</h3>
                    <h4 onClick={() => handleShowAllHistory(key)}>
                      {showAllHistory[key] ? "hide" : "show more"}
                    </h4>
                  </div>
                  {fetchingData ? (
                    <div className="sensorFullGraphCanvas">Waiting...</div>
                  ) : (
                    <canvas
                      id={`${key}LineChart`}
                      className="sensorFullGraphCanvas"
                      width="100%"
                    ></canvas>
                  )}
                </div>
              ) : null}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <section id="sensorNotificationHolder">
        <Swiper
          modules={[EffectCoverflow]}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          onSlideChange={() => ""}
          onSwiper={() => ""}
        >
          {sensorSelectedValues.map((key, index) => (
            <SwiperSlide key={index}>
              {sensor.status === "active" ? (
                <div className="sensorNotification">
                  <div className="optionHolder">
                    <h3>{replaceKey(key)} notifications</h3>
                    <h4>{time}</h4>
                  </div>
                  {fetchingData ? (
                    <div className="sensorFullGraphCanvas">Waiting...</div>
                  ) : (
                    <div id="notificationWrapper">
                      {sensorHistory.dataHistory
                        .slice()
                        .reverse()
                        .map((snapshot, idx) => {
                          const notificationTime = new Date(snapshot.timestamp);
                          const currentTime = new Date();
                          const timeDifference = currentTime - notificationTime;
                          const hoursDifference = Math.floor(
                            timeDifference / (1000 * 60 * 60)
                          );

                          const formattedTime =
                            hoursDifference < 20
                              ? notificationTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })
                              : window.innerWidth < 600
                              ? notificationTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : notificationTime.toLocaleString([], {
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                });

                          const notificationCount =
                            loadedNotifications[key] ||
                            displayedNotifications[key] ||
                            20;

                          if (idx < notificationCount) {
                            return (
                              <div className="notificationStyle" key={idx}>
                                <div className="notificationNameValue">
                                  <div className="notificationName">
                                    {" "}
                                    {window.innerWidth > 800
                                      ? key.startsWith("PM") ||
                                        key.startsWith("NC")
                                        ? key
                                            .replace(/_/g, ".")
                                            .replace(/(PM|NC)(?=\S)/g, "$1 ") +
                                          " value:"
                                        : key
                                            .replace(/_/g, " ")
                                            .replace(/raw/g, "raw ") +
                                          " value: "
                                      : " value: "}
                                  </div>
                                  <div className="notificationValue">
                                    {window.innerWidth > 400
                                      ? Math.round(
                                          getHistoryValueFromSensor(
                                            snapshot,
                                            key
                                          ) * 1000
                                        ) /
                                          1000 +
                                        " " +
                                        sensorParameters[key].unit
                                      : Math.round(
                                          getHistoryValueFromSensor(
                                            snapshot,
                                            key
                                          ) * 1000
                                        ) / 1000}
                                  </div>
                                </div>
                                <div className="notificationTimeShowMoreInfo">
                                  <div className="notificationTime">
                                    {hoursDifference < 20
                                      ? "Today " + formattedTime
                                      : formattedTime}
                                  </div>
                                  <div
                                    className="notificationShowMoreInfo"
                                    onClick={() => {
                                      handleShowMoreInfo(snapshot, key);
                                    }}
                                  >
                                    ?
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      {!loadingNotifications && (
                        <div className="notificationInfo">
                          <button
                            className={
                              loadedNotifications[key] >=
                              sensorHistory.dataHistory.length
                                ? "notificationsEND"
                                : "loadMore"
                            }
                            onClick={() => handleLoadMoreNotifications(key)}
                          >
                            {loadedNotifications[key] >=
                            sensorHistory.dataHistory.length
                              ? "No more notifications"
                              : "Load More"}
                          </button>
                          <div className="notificationCount">
                            ({loadedNotifications[key] || 20})
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </SwiperSlide>
          ))}
        </Swiper>
        {moreInfo ? (
          <div id="notificationMoreInfoHolder">
            {Object.keys(moreInfoData).map((key) => (
              <div key={key} className="notificationMoreInfo">
                <div className="moreInfoColumn">Detailed information</div>
                <div className="moreInfoRow">
                  <div>sensor:</div>
                  <div>{sensor.sensorId}</div>
                </div>
                <div className="moreInfoRow">
                  <div>name:</div>
                  <div>{sensor.name}</div>
                </div>
                <div className="moreInfoRow">
                  <div>data:</div>
                  <div>{replaceKey(key)}</div>
                </div>
                <div className="moreInfoRow">
                  <div>value:</div>
                  <div
                    style={
                      graphColor(getValueFromSensor(sensor, key), key) ===
                      "#01a437"
                        ? { color: "#01a437" }
                        : graphColor(getValueFromSensor(sensor, key), key) ===
                          "#FFA500"
                        ? { color: "#FFA500" }
                        : { color: "#FF0000" }
                    }
                  >
                    {Math.round(moreInfoData[key] * 100000) / 100000 +
                      " " +
                      sensorParameters[key].unit}
                  </div>
                </div>
                <div className="moreInfoRow">
                  <div>{"range:"}</div>
                  <div>{sensorParameters[key].range.join(" - ")}</div>
                </div>
                <div className="moreInfoRow">
                  <div>{"safe range:"}</div>
                  <div>{sensorParameters[key].safeRange.join(" - ")}</div>
                </div>
                <div
                  className="moreInfoColumn"
                  style={
                    graphColor(getValueFromSensor(sensor, key), key) ===
                    "#01a437"
                      ? { color: "#01a437" }
                      : graphColor(getValueFromSensor(sensor, key), key) ===
                        "#FFA500"
                      ? { color: "#FFA500" }
                      : { color: "#FF0000" }
                  }
                >
                  {graphColor(getValueFromSensor(sensor, key), key) ===
                  "#01a437"
                    ? "Safe value"
                    : graphColor(getValueFromSensor(sensor, key), key) ===
                      "#FFA500"
                    ? "Warning value"
                    : "Dangerous value"}
                </div>
                <button
                  className="button"
                  onClick={closeMoreInfo}
                  style={{ marginTop: "0.75rem" }}
                >
                  Close
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
};

export default SectionWrapper(Sensor, "sensor");
