
"use client";


import { useState, useEffect } from "react";
import { collection, getDocs, query, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ageOptions = [
  "19 and bellow",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "50-69",
  "60 and above",
];
const genderOptions = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
];
const provinceOptions = [
  "Catanduanes",
  "Albay",
  "Camarines Norte",
  "Camarines Sur",
  "Masbate",
  "Sorsogon",
  "Others",
];
const municipalityOptions = [
  "Virac",
  "Bato",
  "Baras",
  "San Miguel",
  "San Andres",
  "Caramoran",
  "Gigmoto",
  "Pandan",
  "Bagamanoc",
  "Viga",
  "Panganiban",
];
const sectorOptions = [
  "NGA",
  "LGU",
  "PRIVATE",
  "WOMEN",
  "STUDENT",
  "PWDS",
  "OSY",
  "PDLS",
  "INDIGENOUS PEOPLE",
  "SENIOR CITIZEN",
  "SUC",
  "FARMERS/FISHER",
  "MSME",
  "OTHERS",
];


export default function DigitalLogbook() {
  // Table state
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    otherGender: "",
    province: "Catanduanes",
    otherProvince: "",
    municipality: "Virac",
    otherMunicipality: "",
    sector: "",
    otherSector: "",
    purpose: "",
    agree: false,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState("");
  const [date, setDate] = useState("");

  // Timer and date effect
  useEffect(() => {
    function updateTimer() {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = String(hours).padStart(2, '0');
      setTimer(`${hours}:${minutes}:${seconds} ${ampm}`);
    }
    function updateDate() {
      const now = new Date();
      setDate(now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
    updateTimer();
    updateDate();
    const timerId = setInterval(updateTimer, 1000);
    const dateId = setInterval(updateDate, 1000);
    return () => { clearInterval(timerId); clearInterval(dateId); };
  }, []);

  // Dynamic field visibility
  const showOtherGender = form.gender === "Other";
  const showOtherProvince = form.province === "Others" || (form.province && !provinceOptions.includes(form.province));
  const showMunicipality = form.province === "Catanduanes";
  const showOtherMunicipality = !showMunicipality;
  const showOtherSector = form.sector === "OTHERS";

  // Handle form changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  // Validation helpers
  function validate() {
    if (!form.name) return "Please enter your name.";
    if (form.phone && !/^\d{11}$/.test(form.phone)) return "Please enter a valid 11-digit phone number.";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Please enter a valid email address.";
    if (!form.age) return "Please select your age group.";
    if (!form.gender) return "Please select your gender.";
    if (showOtherGender && !form.otherGender) return "Please specify your gender.";
    if (!form.province) return "Please select your province.";
    if (showOtherProvince && !form.otherProvince) return "Please specify your province.";
    if (showMunicipality && !form.municipality) return "Please select your municipality.";
    if (showOtherMunicipality && !form.otherMunicipality) return "Please specify your municipality.";
    if (!form.sector) return "Please select your sector.";
    if (showOtherSector && !form.otherSector) return "Please specify your sector.";
    if (!form.purpose) return "Please enter your purpose.";
    if (!form.agree) return "You must consent to data collection.";
    return null;
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    // Compose values as in the provided JS
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    let gender = "";
    if (form.gender === "Other" && form.otherGender.trim() !== "") {
      gender = form.otherGender.trim();
    } else {
      gender = form.gender;
    }
    let municipality = "";
    let province = "";
    if (form.province !== "Catanduanes") {
      municipality = form.otherMunicipality.trim();
      if (form.province === "Others" && form.otherProvince.trim() !== "") {
        province = form.otherProvince.trim();
      } else {
        province = form.province;
      }
    } else {
      municipality = form.municipality;
      province = form.province;
    }
    let sector = "";
    if (form.sector === "OTHERS" && form.otherSector.trim() !== "") {
      sector = form.otherSector.trim();
    } else {
      sector = form.sector;
    }
    const purpose = form.purpose.trim();
    const age_group = form.age;

    // Prevent duplicate entries (same name, purpose, same day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    try {
      // Query for existing entry
      const q = query(collection(db, "catanduanes_logbook_entries"));
      const querySnapshot = await getDocs(q);
      let duplicateFound = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.name === name &&
          data.purpose === purpose &&
          data.timestamp &&
          new Date(data.timestamp.seconds * 1000) >= today &&
          new Date(data.timestamp.seconds * 1000) < tomorrow
        ) {
          duplicateFound = true;
        }
      });
      if (duplicateFound) {
        setError("Please change the purpose to submit a new entry.");
        return;
      }

      // Add to Firestore
      await addDoc(collection(db, "catanduanes_logbook_entries"), {
        name,
        phone,
        email,
        age_group,
        gender,
        province,
        municipality,
        sector,
        purpose,
        timestamp: new Date(),
      });

      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        age: "",
        gender: "",
        otherGender: "",
        province: "Catanduanes",
        otherProvince: "",
        municipality: "Virac",
        otherMunicipality: "",
        sector: "",
        otherSector: "",
        purpose: "",
        agree: false,
      });
      // Optionally reload entries
      // window.location.reload();
    } catch (error) {
      setError("Failed to submit the form. Please try again.");
      // eslint-disable-next-line no-console
      console.error("Error adding document: ", error);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-0" style={{backgroundImage: 'url(/images/buwan_wika_bg_1.png)', backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'}}>
      {/* Timer and Date */}
      <div className="absolute left-0 top-0 mt-5 ms-1 z-10">
        <h1 className="text-white text-4xl font-bold" style={{textShadow: '0 0 8px #000'}}>{timer}</h1>
        <h2 className="text-white text-lg" style={{textShadow: '0 0 8px #000'}}>{date}</h2>
      </div>

<div className="min-h-screen flex flex-col items-center justify-center p-4">
  <div className="w-full max-w-5xl bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 overflow-hidden">
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-center text-3xl font-bold text-gray-700">Digital Logbook</h1>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="JUAN DELA CRUZ"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="09876543210"
              maxLength={11}
              pattern="[0-9]{11}"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="juan@gmail.com"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.email}
              autoComplete="off"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700">Age</label>
            <select
              id="age"
              name="age"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.age}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your age group</option>
              {ageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">Gender</label>
            <select
              id="gender"
              name="gender"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your gender</option>
              {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {showOtherGender && (
            <div>
              <label htmlFor="otherGender" className="block text-sm font-semibold text-gray-700">Specify Other Gender</label>
              <input
                type="text"
                id="otherGender"
                name="otherGender"
                placeholder="Enter your gender"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
                value={form.otherGender}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <div>
            <label htmlFor="province" className="block text-sm font-semibold text-gray-700">Province</label>
            <select
              id="province"
              name="province"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.province}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your province</option>
              {provinceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {showOtherProvince && (
            <div>
              <label htmlFor="otherProvince" className="block text-sm font-semibold text-gray-700">Specify Other Province/City</label>
              <input
                type="text"
                id="otherProvince"
                name="otherProvince"
                placeholder="Enter your province"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
                value={form.otherProvince}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {showMunicipality && (
            <div>
              <label htmlFor="municipality" className="block text-sm font-semibold text-gray-700">Municipality</label>
              <select
                id="municipality"
                name="municipality"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
                value={form.municipality}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select your municipality</option>
                {municipalityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}

          {showOtherMunicipality && (
            <div>
              <label htmlFor="otherMunicipality" className="block text-sm font-semibold text-gray-700">Specify Municipality</label>
              <input
                type="text"
                id="otherMunicipality"
                name="otherMunicipality"
                placeholder="Enter your municipality"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
                value={form.otherMunicipality}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="sector" className="block text-sm font-semibold text-gray-700">Sector</label>
            <select
              id="sector"
              name="sector"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.sector}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your sector</option>
              {sectorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {showOtherSector && (
            <div>
              <label htmlFor="otherSector" className="block text-sm font-semibold text-gray-700">Specify Other Sector</label>
              <input
                type="text"
                id="otherSector"
                name="otherSector"
                placeholder="Enter your sector"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
                value={form.otherSector}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="purpose" className="block text-sm font-semibold text-gray-700">Purpose</label>
            <textarea
              id="purpose"
              name="purpose"
              placeholder="Enter your purpose here"
              rows={5}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase text-black"
              value={form.purpose}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            required
            className="mt-1"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I consent to be included in the organizer’s database for future processing of relevant documents
          </label>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">Thank you for signing in!</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-full font-bold hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  </div>

  {/* Logos */}
  <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
    <img src="/images/bagong-pilipinas.png" alt="Bagong Pilipinas" className="h-16" />
    <a href="/admin"><img src="/images/DICT-Logo-icon_only.png" alt="DICT Logo" className="h-16" /></a>
    <img src="/images/dtc_CATANDUANES.png" alt="DTC Catanduanes" className="h-20" />
    <img src="/images/ilcdb logo.png" alt="ILCDB Logo" className="h-16" />
    <img src="/images/egov.png" alt="eGov Logo" className="h-16" />
  </div>
</div>

    </main>
  );
}
