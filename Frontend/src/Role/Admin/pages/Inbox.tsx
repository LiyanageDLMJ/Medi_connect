import React, { useEffect, useState } from "react";

function UserCountDashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    doctorCount: 0,
    studentCount: 0,
    instituteCount: 0,
    recruiterCount: 0,
    CardiologistCount: 0,
    PediatricianCount: 0,
    GeneralPhysicianCount: 0,
    PulmonologistCount: 0,
    EndocrinologistCount: 0,
  });



  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/users/count")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user counts");
        return res.json();
      })
      .then((data) => setCounts(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>User Summary</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          <li>Total Users: {counts.total}</li>
          <li>Doctors: {counts.doctorCount}</li>
          <li>Medical Students: {counts.studentCount}</li>
          <li>Educational Institutes: {counts.instituteCount}</li>
          <li>Recruiters: {counts.recruiterCount}</li>
          <li>Cardiologist: {counts.CardiologistCount}</li>
          <li>Pediatrician: {counts.PediatricianCount}</li>
          <li>GeneralPhysician: {counts.GeneralPhysicianCount}</li>
          <li>Pulmonologist: {counts.PulmonologistCount}</li>
          <li>Endocrinologist: {counts.EndocrinologistCount}</li>
        </ul>
      )}
    </div>
  );
}

export default UserCountDashboard;
