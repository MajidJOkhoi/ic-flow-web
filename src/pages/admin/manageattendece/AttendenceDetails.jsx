import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { useParams, Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import api from "../../../api";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const AttendanceDetails = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  let { id } = useParams();

  const fetchAttendanceData = async (date) => {
    setLoading(true);
    setAttendanceData([]);
    try {
      const month = date
        .toLocaleString("default", { month: "long" })
        .toLowerCase();
      const year = date.getFullYear();

      const response = await api.get(
        `/api/attendance/getMyMonthAttendanceById?userid=${id}&&month=${month}`
      );

      if (response.data.success && response.data.monthAttendance.length > 0) {
        setAttendanceData(response.data.monthAttendance);
      } else {
        toast.error("No Record Available for the selected month.");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedDate);

    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`/api/user/getUserById/${id}`);
        setUserData(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserInfo();
  }, [selectedDate, id]);

  // Download PDF
  const DownloadPDFReport = () => {
    const doc = new jsPDF();

    // Add title and user info
    doc.setFontSize(18);
    doc.text("Monthly Attendance Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`User ID: ${userData._id}`, 14, 30);
    doc.text(`Name: ${userData.fullName}`, 14, 36);
    doc.text(`Email: ${userData.email}`, 14, 42);
    doc.text(`Month: ${selectedDate.toLocaleString("default", { month: "long" })}`, 14, 48);

    // Add summary
    const presentDays = attendanceData.filter((d) => d.checkIn).length;
    const absentDays = attendanceData.length - presentDays;
    doc.text(`Total Present: ${presentDays}`, 14, 54);
    doc.text(`Total Absent: ${absentDays}`, 14, 60);

    // Table content for attendance
    const tableData = attendanceData.map((attendance) => [
      attendance.date,
      attendance.checkIn || "N/A",
      attendance.checkOut || "N/A",
      `${attendance.duration?.hours || 0} hrs ${attendance.duration?.minutes || 0} mins`,
      attendance.checkIn ? "Present" : "Absent",
    ]);

    // Add table with attendance data
    doc.autoTable({
      head: [["Date", "Check-in", "Check-out", "Duration", "Status"]],
      body: tableData,
      startY: 70,
      theme: "striped",
    });

    // Download the PDF
    doc.save(`${userData.fullName}-Attendance-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}.pdf`);
  };

  // Download Excel
  const DownloadExcelReport = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(
      attendanceData.map((attendance) => ({
        Date: attendance.date,
        "Check-in": attendance.checkIn || "N/A",
        "Check-out": attendance.checkOut || "N/A",
        Duration: `${attendance.duration?.hours || 0} hrs ${attendance.duration?.minutes || 0} mins`,
        Status: attendance.checkIn ? "Present" : "Absent",
      }))
    );
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
  
    XLSX.writeFile(wb, `${userData.fullName}-Attendance-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}.xlsx`);
  };
  

  const handleEditAttendance = (id) => {
    navigate(`/dashboard/admin/edit-attendance/${id}`);
  };


  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/dashboard/admin/home">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/dashboard/admin/attendance">Attendance</Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-2 w-full rounded-3xl shadow-sm shadow-green-50 max-w-sm sm:max-w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-[#0067B8] text-3xl font-[Liberation Mono]">
            Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 ">
          <h2 className="text-[#0067B8] text-2xl font-sm font-bold mb-3 font-[Liberation Mono]">
            User Information
          </h2>
          <h2 className="text-gray-700 font-bold mb-2">
            <span className="text-[#A32D2F] font-bold"> Name : </span>
            {userData.fullName}
          </h2>
          <h2 className=" text-gray-700 font-bold mb-4">
            <span className="text-[#A32D2F] font-bold"> Email : </span>{" "}
            {userData.email}
          </h2>

          <div className="flex justify-between items-center mb-6">
            <div></div>
            <div className="flex">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                className="p-2 border rounded-3xl text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center text-blue-500">Loading...</div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center text-red-500">
              No Record Available for the selected month...
            </div>
          ) : (
            <Table className="w-full text-left text-gray-800 rounded-3xl">
              <TableHeader className="bg-gray-100 ">
                <TableRow>
                  <TableHead className="py-2 px-4">Date</TableHead>
                  <TableHead className="py-2 px-4">Check-in</TableHead>
                  <TableHead className="py-2 px-4">Check-out</TableHead>
                  <TableHead className="py-2 px-4">Duration</TableHead>
                  <TableHead className="py-2 px-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((attendance) => (
                  <TableRow
                    key={attendance._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="py-2 px-4">
                      {attendance.date}
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      {attendance.checkIn || "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      {attendance.checkOut || "N/A"}
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      {attendance.duration?.hours} hrs{" "}
                      {attendance.duration?.minutes} mins
                    </TableCell>

                    <TableCell className="py-2 px-4">
                      <button
                        onClick={DownloadPDFReport}
                        className="flex items-center justify-center p-2 m-2 rounded-md font-bold border border-blue-500  text-blue-500  focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
                      >
                        <Download size={20} className="text-blue-600 mr-2" />
                        PDF
                      </button>

                      <button
                        onClick={() => handleEditAttendance(id)}
                        className="flex items-center justify-center p-2 m-2 rounded-md font-bold border border-blue-500  text-blue-500  focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
                      >
                        <CiEdit size={20} className="text-blue-600 mr-2" />
                        edit
                      </button>

                      <button
                        onClick={DownloadExcelReport}
                        className="flex items-center justify-center p-2 m-2 rounded-md font-bold border border-green-500  text-green-500  focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
                      >
                        <Download size={20} className="text-green-600 mr-2" />
                        Excel
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AttendanceDetails;
