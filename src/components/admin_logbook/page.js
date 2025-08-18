"use client";
import { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


import { getLogbookEntries } from "@/lib/logbook";


function downloadCSV(rows, filename) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      [
        "Name",
        "Phone",
        "Email",
        "Age Group",
        "Gender",
        "Province",
        "Municipality",
        "Sector",
        "Purpose",
        "Date",
        "Time",
      ].join(","),
      ...rows.map((row) =>
        [
          row.name,
          row.phone,
          row.email,
          row.age_group,
          row.gender,
          row.province,
          row.municipality,
          row.sector,
          row.purpose,
          row.date,
          row.time,
        ].join(",")
      ),
    ].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function AdminLogbook() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogbookEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const filteredData = entries.filter((row) => {
    const rowDate = new Date(row.date);
    return (
      rowDate >= dateRange[0].startDate && rowDate <= dateRange[0].endDate
    );
  });

  const maleCount = filteredData.filter((r) => r.gender === "Male").length;
  const femaleCount = filteredData.filter((r) => r.gender === "Female").length;
  const totalCount = filteredData.length;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (

  <div className=" w-full  bg-black rounded-xl shadow-lg p-6">
    <div className="flex justify-end mb-1">
      <button
        className="p-2 rounded-full hover:bg-gray-200 transition"
        title="Settings"
        aria-label="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.25 2.25c.966 0 1.75.784 1.75 1.75v.5a7.5 7.5 0 013.25 1.35l.35-.35a1.75 1.75 0 112.475 2.475l-.35.35A7.5 7.5 0 0121.5 11h.5a1.75 1.75 0 110 3.5h-.5a7.5 7.5 0 01-1.35 3.25l.35.35a1.75 1.75 0 11-2.475 2.475l-.35-.35A7.5 7.5 0 0112.75 21.5v.5a1.75 1.75 0 11-3.5 0v-.5a7.5 7.5 0 01-3.25-1.35l-.35.35a1.75 1.75 0 11-2.475-2.475l.35-.35A7.5 7.5 0 012.5 13H2a1.75 1.75 0 110-3.5h.5a7.5 7.5 0 011.35-3.25l-.35-.35A1.75 1.75 0 116.475 3.9l.35.35A7.5 7.5 0 0111 2.75v-.5c0-.966.784-1.75 1.75-1.75zM12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      </button>
    </div>

    <h1 className="text-2xl font-bold text-center mb-6">Report</h1>

    {/* Filter + Download Section */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <div className="flex items-center gap-2 relative">
        <label className="font-semibold text-base flex items-center">
          <span className="mr-1">📅</span> Filter Date:
        </label>

        <button
          className="border border-gray-300 px-3 py-1 rounded bg-black hover:bg-black-50 text-sm"
          onClick={() => setShowPicker((v) => !v)}
        >
          {format(dateRange[0].startDate, "yyyy-MM-dd")} -{" "}
          {format(dateRange[0].endDate, "yyyy-MM-dd")}
        </button>

        {showPicker && (
          <div className="absolute top-full mt-2 z-50 bg-white shadow-lg p-3 rounded-lg">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              maxDate={new Date()}
            />
            <button
              className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              onClick={() => setShowPicker(false)}
            >
              Close
            </button>
          </div>
        )}

        <button
          className="ml-2 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm"
          onClick={() => {
            setDateRange([
              {
                startDate: addDays(new Date(), -300),
                endDate: new Date(),
                key: "selection",
              },
            ]);
          }}
          title="Clear Filter"
        >
          ❌
        </button>
      </div>

      <button
        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 text-sm font-medium"
        onClick={() =>
          downloadCSV(filteredData, "catanduanes_digital_logbook_report.csv")
        }
      >
        Download CSV
      </button>
    </div>

    {/* Table */}
    <div className="overflow-x-auto max-h-[400px] border  rounded-lg">
      <table className="table-auto w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-white z-10 border-b">
          <tr className="bg-black text-white">
            <th className="px-3 py-2 text-left font-semibold">Name</th>
            <th className="px-3 py-2 text-left font-semibold">Phone</th>
            <th className="px-3 py-2 text-left font-semibold">Email</th>
            <th className="px-3 py-2 text-left font-semibold">Age Group</th>
            <th className="px-3 py-2 text-left font-semibold">Gender</th>
            <th className="px-3 py-2 text-left font-semibold">Province</th>
            <th className="px-3 py-2 text-left font-semibold">Municipality</th>
            <th className="px-3 py-2 text-left font-semibold">Sector</th>
            <th className="px-3 py-2 text-left font-semibold">Purpose</th>
            <th className="px-3 py-2 text-left font-semibold">Date</th>
            <th className="px-3 py-2 text-left font-semibold">Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i} className="border-b hover:bg-yellow-50">
              <td className="px-3 py-2">{row.name}</td>
              <td className="px-3 py-2">{row.phone}</td>
              <td className="px-3 py-2">{row.email}</td>
              <td className="px-3 py-2">{row.age_group}</td>
              <td className="px-3 py-2">{row.gender}</td>
              <td className="px-3 py-2">{row.province}</td>
              <td className="px-3 py-2">{row.municipality}</td>
              <td className="px-3 py-2">{row.sector}</td>
              <td className="px-3 py-2">{row.purpose}</td>
              <td className="px-3 py-2">{row.date}</td>
              <td className="px-3 py-2">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Summary Counts */}
    <div className="flex justify-end gap-2 mt-3">
      <span className="px-3 py-1 rounded-full text-white bg-blue-600 text-xs font-semibold">
        Male: {maleCount}
      </span>
      <span className="px-3 py-1 rounded-full text-white bg-red-600 text-xs font-semibold">
        Female: {femaleCount}
      </span>
      <span className="px-3 py-1 rounded-full text-white bg-gray-600 text-xs font-semibold">
        Total: {totalCount}
      </span>
  </div>

  {/* Logos
  <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
    <img src="/bagong-pilipinas.png" alt="Bagong Pilipinas" className="w-24" />
    <a href="/admin.html">
      <img src="/DICT-Logo-icon_only.png" alt="DICT Logo" className="w-24" />
    </a>
    <img src="/dtc_CATANDUANES.png" alt="DTC Catanduanes" className="w-32" />
    <img src="/ilcdb logo.png" alt="ILCDB" className="w-28" />
    <img src="/egov.png" alt="eGov" className="w-24" />
  </div> */}
</div>

  );
}

export default AdminLogbook;
