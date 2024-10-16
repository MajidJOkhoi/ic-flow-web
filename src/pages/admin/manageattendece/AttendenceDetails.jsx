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
import { useParams, Link, useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import api from "../../../api";
import { BookmarkPlus, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AttendanceDetails = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

      console.log(response.data.monthAttendance);

      if (response.data.success && response.data.monthAttendance.length > 0) {
       const sortedData = response.data.monthAttendance.sort((a, b) => new Date(a.date) - new Date(b.date));
       console.log(sortedData);

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
        console.log(response.data.user);
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

    doc.setFontSize(25);
    doc.setTextColor("#a32d2f");
    doc.text("Monthly Attendance Report", 14, 20);

    doc.setFontSize(14);
    doc.setTextColor("#333333");
    doc.text(`Name: ${userData.fullName}`, 14, 36);
    doc.text(`Email: ${userData.email}`, 14, 42);
    doc.text(
      `Month: ${selectedDate.toLocaleString("default", {
        month: "long",
      })} ${selectedDate.getFullYear()}`,
      14,
      48
    );

    // Calculate summary information
    const presentDays = attendanceData.filter(
      (d) => d.checkIn && d.checkOut
    ).length;

    const absentDays = attendanceData.length - presentDays;

    // Add summary information in a separate table
    doc.autoTable({
      startY: 54,
      head: [["Summary", "Count"]],
      body: [
        ["Total Present Days", presentDays],
        ["Total Absent Days", absentDays],
      ],
      theme: "grid",
      headStyles: { fillColor: "#007bff" },
      bodyStyles: { fillColor: "#f5f5f5" },
    });

    // Prepare table data for attendance
    const tableData = attendanceData.map((attendance) => [
      attendance.date,
      attendance.checkIn || "N/A",
      attendance.checkOut || "N/A",
      `${attendance.duration?.hours || 0} hrs ${
        attendance.duration?.minutes || 0
      } mins`,
      attendance.checkIn && attendance.checkOut ? "Present" : "Absent",
    ]);

    // Add attendance data table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Date", "Check-in", "Check-out", "Duration", "Status"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: "#007bff" },
      bodyStyles: {
        textColor: (data) =>
          data.row.raw[4] === "Present" ? "#28a745" : "#dc3545",
      },
    });

    // Save the PDF file
    doc.save(
      `${userData.fullName}-Attendance-${
        selectedDate.getMonth() + 1
      }-${selectedDate.getFullYear()}.pdf`
    );
  };

  const handleEditAttendance = (id) => {
    navigate(`/dashboard/admin/edit-attendance/${id}`);
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
          <BreadcrumbItem>Attendance Details</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6 w-full rounded-lg shadow-sm max-w-6xl mx-auto">
        <CardHeader className="flex justify-between items-center mt-8 p-4">
          <CardTitle className="text-[#0067B8]  font-bold">
            Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 p-4 rounded-lg bg-blue-50">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              User Information
            </h2>
            <p className="text-gray-700">
              <span className="font-bold text-blue-600">Name:</span>{" "}
              {userData.fullName}
            </p>
            <p className="text-gray-700">
              <span className="font-bold text-blue-600">Email:</span>{" "}
              {userData.email}
            </p>
          </div>

          <div className="flex justify-end mb-4 space-x-4">
            <button
              onClick={DownloadPDFReport}
              className="flex items-center justify-center px-4 py-2 rounded-lg font-bold border border-blue-500 text-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
            >
              <Download size={20} className="text-blue-600 mr-2" />
              Attedance Report PDF
            </button>

            <button
              onClick={() => {
                navigate(`/dashboard/admin/addattendance/${id}`);
              }}
              className="flex items-center justify-center px-4 py-2 rounded-lg font-bold border border-green-500 text-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
            >
              <BookmarkPlus size={20} className="h-6 w-6" />
              Add Attendance
            </button>
          </div>

          <div className="flex justify-end items-center mb-6">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="p-2 border rounded-3xl text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center text-blue-500">Loading...</div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center text-red-500">
              No Record Available for the selected month.
            </div>
          ) : (
            <Table className="w-full text-left text-gray-800 rounded-lg overflow-hidden shadow-sm">
              <TableHeader className="bg-gray-200">
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
                        onClick={() => handleEditAttendance(attendance._id)}
                        className="flex items-center justify-center p-2 rounded-lg font-bold border border-blue-500 text-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-150 ease-in-out"
                      >
                        <CiEdit size={20} className="text-blue-600 mr-2" />
                        Edit
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
