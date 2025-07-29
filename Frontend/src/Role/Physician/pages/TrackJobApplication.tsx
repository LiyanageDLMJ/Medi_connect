"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarWrapper from "../../../Components/SidebarWrapper";

import {
  CalendarDays,
  MapPin,
  Plus,
  Search,
  Building2,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react"

type ApplicationStatus =
  | "applied"
  | "phone-screen"
  | "interview-scheduled"
  | "in-review"
  | "final-interview"
  | "offer"
  | "rejected"
  | "withdrawn"

interface JobApplication {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    hospitalName: string;
    location: string;
    salaryRange: string;
    department: string;
    jobType: string;
  };
  name: string;
  email: string;
  phone: string;
  experience: string;
  cv: string;
  status: ApplicationStatus;
  recruiterFeedback?: string;
  appliedDate: string;
  lastUpdate: string;
}

const statusConfig = {
  applied: { label: "Applied", color: "bg-blue-100 text-blue-800", icon: Clock },
  "phone-screen": { label: "Phone Screen", color: "bg-purple-100 text-purple-800", icon: Clock },
  "interview-scheduled": { label: "Interview Scheduled", color: "bg-yellow-100 text-yellow-800", icon: CalendarDays },
  "in-review": { label: "In Review", color: "bg-orange-100 text-orange-800", icon: AlertCircle },
  "final-interview": { label: "Final Interview", color: "bg-indigo-100 text-indigo-800", icon: CalendarDays },
  offer: { label: "Offer", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-800", icon: XCircle },
}

// Custom Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
}

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-6 pb-2 ${className}`}>{children}</div>
}

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}

const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
}

const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "outline"
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4"
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
      : "bg-gray-900 text-white hover:bg-gray-800"

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  )
}

const Input = ({
  placeholder,
  value,
  onChange,
  className = "",
}: {
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  )
}

const Select = ({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{value === "all" ? "All Statuses" : statusConfig[value as ApplicationStatus]?.label || value}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
          <div className="p-1">
            <div
              onClick={() => {
                onValueChange("all")
                setIsOpen(false)
              }}
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
            >
              All Statuses
            </div>
            {Object.entries(statusConfig).map(([key, config]) => (
              <div
                key={key}
                onClick={() => {
                  onValueChange(key)
                  setIsOpen(false)
                }}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
              >
                {config.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  )
}

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  );
}

const Table = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
    </div>
  )
}

const TableHeader = ({ children }: { children: React.ReactNode }) => {
  return <thead className="[&_tr]:border-b">{children}</thead>
}

const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
}

const TableRow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <tr className={`border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50 ${className}`}>
      {children}
    </tr>
  )
}

const TableHead = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    >
      {children}
    </th>
  )
}

const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>
}

export default function JobApplicationTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userProfile, setUserProfile] = useState<{ name: string; photoUrl?: string }>({ name: "" });

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
        const res = await fetch(`http://localhost:3000/JobApplication/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message || "Error fetching applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;
      try {
        const res = await fetch('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': userId,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserProfile({ name: data.name, photoUrl: data.photoUrl });
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, []);

  // Calculate status counts based on real data
  const statusCounts = {
    total: applications.length,
    active: applications.filter(app => !['rejected', 'withdrawn', 'offer'].includes(app.status)).length,
    offers: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.jobId?.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Application row component
  const ApplicationRow = ({ application, className = "" }: { application: JobApplication; className?: string }) => (
    <TableRow key={application._id} className={className}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          {application.jobId?.hospitalName || 'N/A'}
        </div>
      </TableCell>
      <TableCell>
        {application.jobId?.title || "N/A"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-500" />
          {application.jobId?.location || "N/A"}
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {application.jobId?.salaryRange ? (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gray-500" />
            {application.jobId.salaryRange}
          </div>
        ) : "N/A"}
      </TableCell>
      <TableCell>
        <StatusBadge status={application.status} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {new Date(application.appliedDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {new Date(application.lastUpdate).toLocaleDateString()}
      </TableCell>
    </TableRow>
  );

  // Loading state
  if (loading) {
    return (
      <SidebarWrapper>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading applications...</div>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <SidebarWrapper>
        <div className="container mx-auto p-6">
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <div className="flex">
      <SidebarWrapper />
      <div className="flex-1 overflow-auto md:pl-64">
        <div className="min-h-screen bg-white">
          {/* Doctor name at top right */}
          <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-3xl shadow-md mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
              <div>
                <h1 className="text-4xl font-extrabold text-blue-900 flex items-center gap-2">
                  <CheckCircle className="text-blue-500 w-10 h-10" />
                  Medical Job Application Tracker
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Track and manage your medical career applications</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={userProfile.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"}
                  className="w-16 h-16 rounded-full border-4 border-blue-200 shadow"
                  alt={userProfile.name}
                />
                <span className="font-semibold text-gray-700 mt-2">
                  {userProfile.name ? `Dr. ${userProfile.name}` : ""}
                </span>
              </div>
            </div>
          </div>
        <div className="container mx-auto p-6 space-y-10">
        {/* Header */}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="transition-transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <div className="bg-blue-100 p-2 rounded-full">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
            </CardContent>
          </Card>
          <Card className="transition-transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <div className="bg-purple-100 p-2 rounded-full">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.active}</div>
            </CardContent>
          </Card>
          <Card className="transition-transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.offers}</div>
            </CardContent>
          </Card>
          <Card className="transition-transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejections</CardTitle>
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>Track your medical job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search companies or positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full sm:w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <div className="p-1">
                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100">
                      All Statuses
                    </div>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <div
                        key={key}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
                      >
                        {config.label}
                      </div>
                    ))}
                  </div>
                </Select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="rounded-md border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden lg:table-cell">Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Applied</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application, idx) => (
                    <ApplicationRow
                      key={application._id}
                      application={application}
                      className={idx % 2 === 0 ? "bg-gray-50" : ""}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {applications.length === 0 ? "No applications found. Start applying for jobs!" : "No applications found matching your criteria."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Application Pipeline</CardTitle>
            <CardDescription>Overview of applications by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = applications.filter((app) => app.status === status).length
                const Icon = config.icon

                return (
                  <div key={status} className={`text-center p-4 rounded-lg border border-gray-200 shadow-sm ${config.color}`}>
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs">{config.label}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
  )
}
