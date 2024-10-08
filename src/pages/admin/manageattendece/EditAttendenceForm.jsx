import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useParams } from "react-router-dom";
import api from '../../../api';

const EditAttendanceForm = () => {
  const [attendanceData, setAttendanceData] = useState({
    startTime: "",
    endTime: "",
  });
  
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':');
    let seconds = "00"; 
    let period = 'AM';
    hours = parseInt(hours);
    
    if (hours >= 12) {
      period = 'PM';
      hours = hours > 12 ? hours - 12 : hours;
    } else if (hours === 0) {
      hours = 12;
    }

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    const formattedSeconds = seconds.padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  };

  const handleChange = (e) => {
    setAttendanceData({
      ...attendanceData,
      [e.target.name]: e.target.value,
    });
  };



  const isEndTimeValid = (startTime, endTime) => {
    return new Date(`1970-01-01T${endTime}:00`) > new Date(`1970-01-01T${startTime}:00`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEndTimeValid(attendanceData.startTime, attendanceData.endTime)) {
      toast.error("Check-out time must be later than check-in time.");
      return;
    }

    setLoading(true);

    const updatedData = {
      startTime: convertTo12HourFormat(attendanceData.startTime),
      endTime: convertTo12HourFormat(attendanceData.endTime),
    };

    try {
      const response = await api.post(`/api/attendance/update/${id}`, {
        date: selectedDate,
        ...updatedData,
      });

      if (response.data.success) {
        toast.success("Attendance updated successfully!");
      } else {
        toast.error("Failed to update attendance.");
      }
    } catch (error) {
      toast.error("An error occurred while updating attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard/admin">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/dashboard/admin/attendance">Attendance</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>Edit Attendance</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-2 w-full rounded-3xl shadow-sm shadow-green-50 max-w-sm sm:max-w-full">
        <CardHeader>
          <CardTitle className="text-[#0067B8] text-3xl font-[Liberation Mono] text-center">
            Edit Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/dd/yyyy"
                className="p-2 border rounded-3xl text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Check-in Time</label>
              <input
                type="time"
                name="startTime"
                value={attendanceData.startTime}
                onChange={handleChange}
                className="p-2 border rounded-3xl w-full text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Check-out Time</label>
              <input
                type="time"
                name="endTime"
                value={attendanceData.endTime}
                onChange={handleChange}
                className="p-2 border rounded-3xl w-full mb-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-[#BA0D09] hover:bg-[#BA0D09] text-white py-2 px-4 rounded-3xl shadow-lg transition duration-200"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Attendance"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default EditAttendanceForm;
