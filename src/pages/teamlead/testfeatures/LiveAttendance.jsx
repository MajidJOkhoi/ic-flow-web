import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";

function LiveAttendance() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [todayattendance,setTodayAttendance] = useState({});

  const [attendanceData, setAttendanceData] = useState({
    checkIn: null,
    checkOut: null,
  });


  

  const getFormattedDate = () => {
    const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  const convertTo12HourFormat = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const secondsStr = seconds < 10 ? "0" + seconds : seconds;
    return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
  };


  const getTodayAttendance = async () => {
    
    try {
      const date = getFormattedDate();
      console.log(date)
    
      const response = await api.get(`/api/attendance/getTodayAttendance/${date}`);
      
      console.log(response.data.attendance[0].checkIn)

      setTodayAttendance(response.data.attendance[0]);


    } catch (error) {
      // setStatus("Error fetching today's attendance: " + error.message);
      // toast.error("Error fetching today's attendance!");
    }
  };

  useEffect(() => {
    getTodayAttendance();
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          setStatus("Unable to retrieve your live location: " + error.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setStatus("Geolocation is not supported by your browser.");
    }


  }, []);

  console.log(todayattendance)

  const handleCheckIn = async () => {
    const checkInTime = new Date();
    setLoading(true);

    setAttendanceData((prev) => ({
      ...prev,
      checkIn: {
        latitude: location.lat,
        longitude: location.lng,
        time: checkInTime,
      },
    }));

    try {
      await api.post("/api/attendance/checkIn", {
        checkIn: {
          latitude: location.lat,
          longitude: location.lng,
          time: convertTo12HourFormat(checkInTime),
        },
        date: getFormattedDate(),
      });
      setStatus("Checked in successfully!");
      toast.success("Checked in successfully!");
      setCheckedIn(true);
    } catch (error) {
      setStatus("Error during check-in: " + error.message);
      toast.error("Error during check-in!");
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    const checkOutTime = new Date();
    setLoading(true);
    setAttendanceData((prev) => ({
      ...prev,
      checkOut: {
        latitude: location.lat,
        longitude: location.lng,
        time: checkOutTime,
      },
    }));

    try {
      await api.post("/api/attendance/checkOut", {
        checkOut: {
          latitude: location.lat,
          longitude: location.lng,
          time: convertTo12HourFormat(checkOutTime),
        },
        date: getFormattedDate(),
      });
      setStatus("Checked out successfully!");
      toast.success("Checked out successfully!");
    } catch (error) {
      setStatus("Error during check-out: " + error.message);
      toast.error("Error during check-out!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6 mt-8">
      <h1 className="text-2xl font-bold">Track and Send Attendance</h1>


      {location.lat && location.lng ? (
        <p className="text-center">
          <strong>Latitude:</strong> {location.lat}, <strong>Longitude:</strong> {location.lng}
        </p>
      ) : (
        <p>Waiting for live location...</p>
      )}

      <div className="flex space-x-8 mt-4">
        {/* Check-In Button */}

        {!todayattendance.checkIn && (
          <button
            className={`button ${loading ? "animate-pulse" : ""}`}
            onClick={handleCheckIn}
            disabled={loading}
          >
            {loading ? "Loading..." : "Check In"}
            <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
              <path
                clipRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Check-Out Button */}
        {!todayattendance.checkOut && (
          <button className="button" onClick={handleCheckOut} disabled={loading}>
            Check Out
            <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
              <path
                clipRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* <p className={`text-center mt-4 ${status.includes("Error") ? "text-red-500" : "text-green-500"}`}>
        {status}
      </p> */}
      
    </div>
  );
}

export default LiveAttendance;
