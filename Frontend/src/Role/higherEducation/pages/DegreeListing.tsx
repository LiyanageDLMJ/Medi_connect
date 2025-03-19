// import React from 'react'
// import NavBar from "../components/NavBar/NavBar";
// const DegreeListing = () => {
//   return (
//     <div>
//     <NavBar />
//     <div>DegreeListing</div>
//     </div>
//   )
// }

// export default DegreeListing
import { useState } from "react";
import NavBar from "../components/NavBar/NavBar";

type Degree = {
  id: number;
  name: string;
  institution: string;
  duration: string;
  location: string;
  type: string;
  tuition: string;
};

const DegreeListing = () => {
  const [degrees, setDegrees] = useState<Degree[]>([
    {
      id: 1,
      name: "MBBS (Bachelor of Medicine & Surgery)",
      institution: "Harvard Medical School",
      duration: "6 Years",
      location: "USA",
      type: "Full-Time",
      tuition: "Above $50,000",
    },
    {
      id: 2,
      name: "MSc in Clinical Medicine",
      institution: "Oxford University",
      duration: "2 Years",
      location: "UK",
      type: "Full-Time",
      tuition: "Above $30,000",
    },
  ]);

  const [newDegree, setNewDegree] = useState<Omit<Degree, "id">>({
    name: "",
    institution: "",
    duration: "",
    location: "",
    type: "",
    tuition: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDegree({ ...newDegree, [e.target.name]: e.target.value });
  };

  const handleAddDegree = () => {
    if (Object.values(newDegree).some((field) => field === "")) {
      alert("Please fill in all fields");
      return;
    }
    setDegrees([...degrees, { id: degrees.length + 1, ...newDegree }]);
    setNewDegree({ name: "", institution: "", duration: "", location: "", type: "", tuition: "" });
  };

  const handleDeleteDegree = (id: number) => {
    setDegrees(degrees.filter((degree) => degree.id !== id));
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Manage Degree Programs</h2>
        <div className="mb-4 p-4 border rounded-lg shadow">
          <h3 className="text-lg font-semibold">Add New Degree</h3>
          <input name="name" value={newDegree.name} onChange={handleChange} placeholder="Degree Name" className="border p-2 m-2 w-full" />
          <input name="institution" value={newDegree.institution} onChange={handleChange} placeholder="Institution" className="border p-2 m-2 w-full" />
          <input name="duration" value={newDegree.duration} onChange={handleChange} placeholder="Duration" className="border p-2 m-2 w-full" />
          <input name="location" value={newDegree.location} onChange={handleChange} placeholder="Location" className="border p-2 m-2 w-full" />
          <input name="type" value={newDegree.type} onChange={handleChange} placeholder="Study Mode" className="border p-2 m-2 w-full" />
          <input name="tuition" value={newDegree.tuition} onChange={handleChange} placeholder="Tuition Fees" className="border p-2 m-2 w-full" />
          <button onClick={handleAddDegree} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Add Degree</button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Degree List</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Institution</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Tuition</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {degrees.map((degree) => (
                <tr key={degree.id} className="border">
                  <td className="border p-2">{degree.name}</td>
                  <td className="border p-2">{degree.institution}</td>
                  <td className="border p-2">{degree.duration}</td>
                  <td className="border p-2">{degree.location}</td>
                  <td className="border p-2">{degree.type}</td>
                  <td className="border p-2">{degree.tuition}</td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteDegree(degree.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DegreeListing;
