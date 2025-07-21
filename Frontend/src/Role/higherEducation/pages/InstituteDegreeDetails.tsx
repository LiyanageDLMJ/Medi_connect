import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MUIButton, TextField as MUITextField, Select as MUISelect, MenuItem as MUIMenuItem, FormControl as MUIFormControl, InputLabel as MUIInputLabel } from '@mui/material';

const InstituteDegreeDetails: React.FC = () => {
  const { id } = useParams();
  const [degree, setDegree] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'applicants' | 'details'>('applicants');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const openEditOnLoad = searchParams.get("edit") === "true";
  const [applicants, setApplicants] = useState<any[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:3000/degrees/viewDegrees/${id}`);
        setDegree(response.data);
      } catch (err) {
        setError("Failed to fetch degree details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDegree();
  }, [id]);

  useEffect(() => {
    if (openEditOnLoad && degree) {
      handleEditOpen();
    }
    // Only run when degree is loaded or search param changes
  }, [openEditOnLoad, degree]);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!degree?._id && !degree?.id) return;
      setApplicantsLoading(true);
      setApplicantsError(null);
      try {
        // Corrected endpoint
        const response = await axios.get(`http://localhost:3000/viewDegreeApplications/view?degreeId=${degree._id || degree.id}`);
        setApplicants(response.data.applications || []);
      } catch (err: any) {
        setApplicantsError("Failed to fetch applicants.");
      } finally {
        setApplicantsLoading(false);
      }
    };
    if (degree) fetchApplicants();
  }, [degree]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!degree) return <div>No degree found.</div>;

  const statusBadge = (status: string) => {
    let color = "bg-gray-500";
    let text = status;
    if (status === "PENDING") { color = "bg-yellow-500"; text = "Pending"; }
    else if (status === "APPROVED") { color = "bg-green-500"; text = "Approved"; }
    else if (status === "REJECTED") { color = "bg-red-500"; text = "Rejected"; }
    return <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${color}`}>{text}</span>;
  };

  // Add mockApplicants definition back
  const mockApplicants: Array<{
    id: string;
    name: string;
    profilePic: string;
    status: string;
    appliedDate: string;
    currentEducation: string;
  }> = [
    {
      id: "1",
      name: "Jake Gyll",
      profilePic: "",
      status: "PENDING",
      appliedDate: "13 July, 2021",
      currentEducation: "BSc Biology, 3rd Year",
    },
    {
      id: "2",
      name: "Cymdy Lillibridge",
      profilePic: "",
      status: "APPROVED",
      appliedDate: "12 July, 2021",
      currentEducation: "MBBS Graduate",
    },
    {
      id: "3",
      name: "Rodolfo Goode",
      profilePic: "",
      status: "REJECTED",
      appliedDate: "11 July, 2021",
      currentEducation: "BSc Microbiology, 2nd Year",
    },
    {
      id: "4",
      name: "Leif Floyd",
      profilePic: "",
      status: "APPROVED",
      appliedDate: "11 July, 2021",
      currentEducation: "BSc Chemistry, 4th Year",
    },
    {
      id: "5",
      name: "Jenny Wilson",
      profilePic: "",
      status: "APPROVED",
      appliedDate: "9 July, 2021",
      currentEducation: "BSc Biochemistry, 3rd Year",
    },
    {
      id: "6",
      name: "Jerome Bell",
      profilePic: "",
      status: "PENDING",
      appliedDate: "5 July, 2021",
      currentEducation: "BSc Medical Science, 2nd Year",
    },
  ];

  // Open modal and prefill form
  const handleEditOpen = () => {
    setEditForm({ ...degree, perks: Array.isArray(degree.perks) ? degree.perks.join(', ') : '' });
    setEditImageFile(null);
    setEditImagePreview(degree.image || null);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditError(null);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };
  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError(null);
    try {
      let response;
      const updated = { ...editForm, perks: editForm.perks.split(/,|\n/).map((p: string) => p.trim()).filter(Boolean) };
      if (editImageFile) {
        // Use FormData if a new image is selected
        const formData = new FormData();
        Object.entries(updated).forEach(([key, value]) => {
          if (key === 'perks' && Array.isArray(value)) {
            value.forEach((perk) => formData.append('perks', perk));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value as string);
          }
        });
        formData.append('skillsRequired', editForm.skillsRequired || '');
        formData.append('image', editImageFile);
        response = await axios.patch(
          `http://localhost:3000/degrees/updateDegree/${degree._id || degree.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        // No new image, send JSON
        response = await axios.patch(
          `http://localhost:3000/degrees/updateDegree/${degree._id || degree.id}`,
          { ...updated, skillsRequired: editForm.skillsRequired }
        );
      }
      setDegree(response.data);
      setEditOpen(false);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Failed to update degree.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <TopBar />
        <div className="flex flex-col p-6 md:pl-72 gap-6">
          {/* Header Row: Back button + Degree Name + Status */}
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none text-lg font-medium bg-transparent border-none p-0"
              style={{ boxShadow: "none" }}
            >
              <FaArrowLeft className="mr-2" />
            </button>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 mr-2">{degree.degreeName}</span>
          </div>
          <div className="bg-white rounded-xl shadow p-8 mb-6">
            {/* Tabs */}
            <div className="flex gap-6 border-b mb-6">
              <button
                className={`pb-2 px-2 text-lg font-semibold border-b-2 transition-colors ${activeTab === 'applicants' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                onClick={() => setActiveTab('applicants')}
              >
                Applicants
              </button>
              <button
                className={`pb-2 px-2 text-lg font-semibold border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                onClick={() => setActiveTab('details')}
              >
                Degree Details
              </button>
            </div>
            {activeTab === 'details' ? (
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold mb-0">{degree.degreeName}</h1>
                    <button
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-200 font-semibold text-sm"
                      onClick={handleEditOpen}
                    >
                      Edit  
                    </button>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 mb-6 relative">
                    {/* Image absolutely fixed in top right on desktop, stacked on mobile */}
                    <div className="block md:absolute md:top-6 md:right-6 md:w-40 md:h-40 md:z-10">
                      {degree.image ? (
                        <img
                          src={degree.image}
                          alt="Degree"
                          onError={e => {
                            (e.target as HTMLImageElement).src = '/default-degree.png';
                          }}
                        />
                      ) : (
                        <div className="h-40 w-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg border shadow mx-auto md:mx-0">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="w-full md:pr-48 md:pl-0 md:pt-0 break-words">
                      <h2 className="font-semibold text-lg mb-2">Description</h2>
                      <p className="text-gray-700 mb-4">{degree.description}</p>
                      <h3 className="font-semibold mb-1">Eligibility</h3>
                      <p className="text-gray-700 mb-4">{degree.eligibility}</p>
                      <h3 className="font-semibold mb-1">Skills Required</h3>
                      <p className="text-gray-700 mb-4">{degree.skillsRequired ? degree.skillsRequired : <span className="italic text-gray-400">Not specified</span>}</p>
                    </div>
                  </div>
                  {/* Perks & Benefits Section */}
                  <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="font-semibold text-lg mb-4">Perks & Benefits</h2>
                    {degree.perks && degree.perks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {degree.perks.map((perk: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-full">✅</span>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No perks or benefits listed for this degree.</p>
                    )}
                  </div>
                </div>
                {/* Sidebar */}
                <div className="flex flex-col gap-6 w-full md:w-96">
                  {/* Availability Section - Styled like reference */}
                  <div className="bg-[#f8fafc] rounded-xl p-6 shadow-sm mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg mb-4">About this degree</h3>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-green-700 text-base">{applicants.length} applied</span>
                        <span className="text-gray-500 text-sm ml-1">of {degree.seatsAvailable} capacity</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-400 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (applicants.length / degree.seatsAvailable) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-semibold ${degree.status === 'Open' ? 'text-green-700' : 'text-red-700'}`}>{degree.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Apply Before</span>
                        <span className="font-semibold text-gray-900">{new Date(degree.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Posted On</span>
                        <span className="font-semibold text-gray-900">{new Date(degree.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Mode</span>
                        <span className="font-semibold text-gray-900">{degree.mode}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tuition Fee</span>
                        <span className="font-semibold text-gray-900">{degree.tuitionFee}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-semibold text-gray-900">{degree.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Total Applicants: {applicants.length}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search Applicants"
                      className="p-2 border border-gray-300 rounded w-56"
                    />
                    <button
                      className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm bg-white text-sm font-medium rounded hover:bg-gray-50 focus:outline-none"
                      type="button"
                    >
                      <FiFilter className="mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
                {applicantsLoading ? (
                  <div>Loading applicants...</div>
                ) : applicantsError ? (
                  <div className="text-red-600">{applicantsError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Applicant</th>
                          <th className="p-3 text-left">Current Education</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Applied Date</th>
                          <th className="p-3 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants.length === 0 ? (
                          <tr><td colSpan={5} className="text-center p-4">No applicants found.</td></tr>
                        ) : (
                          applicants.map((applicant) => (
                            <tr key={applicant.id} className="hover:bg-gray-50">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={applicant.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name || 'Applicant')}`}
                                    alt={applicant.name}
                                    className="w-8 h-8 rounded-full object-cover border"
                                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name || 'Applicant')}`; }}
                                  />
                                  <span className="font-medium">{applicant.name}</span>
                                </div>
                              </td>
                              <td className="p-3">{applicant.currentEducation || '-'}</td>
                              <td className="p-3">{statusBadge(applicant.status)}</td>
                              <td className="p-3">{applicant.appliedDate}</td>
                              <td className="p-3 text-sm font-medium flex items-center gap-2">
                                <button
                                  onClick={() => navigate(`/higher-education/degree-listing/view-applications/${applicant.id}`)}
                                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 border border-blue-200"
                                >
                                  See Application
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Degree Details</DialogTitle>
        <DialogContent dividers>
          {editError && <div className="text-red-600 text-sm mb-2">{editError}</div>}
          {editForm && (
            <div className="space-y-6">
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Degree Name</label>
                <MUITextField
                  name="degreeName"
                  value={editForm.degreeName}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  placeholder="Enter degree name"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Status</label>
                <MUIFormControl fullWidth size="small">
                  <MUISelect
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
                    <MUIMenuItem value="Open">Open</MUIMenuItem>
                    <MUIMenuItem value="Closed">Closed</MUIMenuItem>
                  </MUISelect>
                </MUIFormControl>
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Mode</label>
                <MUIFormControl fullWidth size="small">
                  <MUISelect
                    name="mode"
                    value={editForm.mode}
                    onChange={handleEditChange}
                  >
                    <MUIMenuItem value="Online">Online</MUIMenuItem>
                    <MUIMenuItem value="Offline">Offline</MUIMenuItem>
                    <MUIMenuItem value="Hybrid">Hybrid</MUIMenuItem>
                  </MUISelect>
                </MUIFormControl>
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Duration</label>
                <MUITextField
                  name="duration"
                  value={editForm.duration}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  placeholder="e.g. 4 Years"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Seats Available</label>
                <MUITextField
                  name="seatsAvailable"
                  type="number"
                  value={editForm.seatsAvailable}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  placeholder="Enter number of seats"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Tuition Fee</label>
                <MUITextField
                  name="tuitionFee"
                  value={editForm.tuitionFee}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  placeholder="e.g., $15,000 per year"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Eligibility</label>
                <MUITextField
                  name="eligibility"
                  value={editForm.eligibility}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  placeholder="Enter eligibility criteria"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Description</label>
                <MUITextField
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  placeholder="Enter degree description"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Skills Required</label>
                <MUITextField
                  name="skillsRequired"
                  value={editForm.skillsRequired || ''}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  placeholder="Enter skills required"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Perks (comma or newline separated)</label>
                <MUITextField
                  name="perks"
                  value={editForm.perks}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  placeholder="e.g. Scholarships, Industry Exposure, Free Lab Access"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Degree Image</label>
                {editImagePreview && (
                  <div className="mb-2">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded border"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleEditImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Accepted formats: JPEG, JPG, PNG, WebP (max 5MB)
                </p>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <MUIButton onClick={handleEditClose} disabled={editLoading}>Cancel</MUIButton>
          <MUIButton onClick={handleEditSubmit} disabled={editLoading} variant="contained" color="primary">
            {editLoading ? 'Saving...' : 'Save Changes'}
          </MUIButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InstituteDegreeDetails; 