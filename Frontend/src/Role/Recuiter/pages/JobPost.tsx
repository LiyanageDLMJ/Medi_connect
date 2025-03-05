"use client"

import type React from "react"
import NavBar from "../components/NavBar/NavBar"

import { useState } from "react"
import styled from "styled-components"
import { FaCalendarAlt, FaStethoscope } from "react-icons/fa"

// Styled Components
const FormContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
`

const Card = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const CardHeader = styled.div`
 background: linear-gradient(135deg, #2E5FB7 0%, #1a365d 100%);
  color: white;
  padding: 1.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
`

const CardContent = styled.div`
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`

const Label = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #0891b2;
    box-shadow: 0 0 0 1px #0891b2;
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0891b2;
    box-shadow: 0 0 0 1px #0891b2;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0891b2;
    box-shadow: 0 0 0 1px #0891b2;
  }
`

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`

const RadioInput = styled.input`
  cursor: pointer;
`

const Button = styled.button<{ variant?: "primary" | "outline" }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${(props) =>
    props.variant === "outline"
      ? `
      background-color: transparent;
      border: 1px solid #d1d5db;
      color: #374151;
      
      &:hover {
        background-color: #f9fafb;
      }
    `
      : `
      background: linear-gradient(135deg, #2E5FB7 0%, #1a365d 100%);
      border: 1px solid #0891b2;
      color: white;
      
      &:hover {
        background-color: #0e7490;
      }
    `}
`

const RequiredMark = styled.span`
  color: #ef4444;
`

export default function DoctorJobPostingForm() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    facilityName: "",
    locationType: "",
    location: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    specialization: "",
    jobDescription: "",
    requirements: "",
    benefits: "",
    applicationDeadline: "",
    contactEmail: "",
    contactPhone: "",
    boardCertification: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, locationType: value }))
  }

  return (
    <div>
      <NavBar/>
    
    <FormContainer>
      <Card>
        <CardHeader>
          <CardTitle>
            <FaStethoscope /> Create Medical Position
          </CardTitle>
          <CardDescription>Post a new physician or medical professional position</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FormRow>
              <FormGroup>
                <Label htmlFor="jobTitle">
                  Position Title <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g. Cardiologist, Family Physician"
                  required
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="facilityName">
                  Hospital/Facility Name <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="facilityName"
                  name="facilityName"
                  placeholder="e.g. Memorial Hospital"
                  required
                  value={formData.facilityName}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>
                Practice Setting <RequiredMark>*</RequiredMark>
              </Label>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="locationType"
                    value="hospital"
                    checked={formData.locationType === "hospital"}
                    onChange={() => handleRadioChange("hospital")}
                    required
                  />
                  Hospital
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="locationType"
                    value="clinic"
                    checked={formData.locationType === "clinic"}
                    onChange={() => handleRadioChange("clinic")}
                  />
                  Clinic
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="locationType"
                    value="private"
                    checked={formData.locationType === "private"}
                    onChange={() => handleRadioChange("private")}
                  />
                  Private Practice
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="locationType"
                    value="telehealth"
                    checked={formData.locationType === "telehealth"}
                    onChange={() => handleRadioChange("telehealth")}
                  />
                  Telehealth
                </RadioLabel>
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="location">
                Location <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Boston, MA"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="specialization">
                  Specialization <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  id="specialization"
                  name="specialization"
                  required
                  value={formData.specialization}
                  onChange={handleChange}
                >
                  <option value="">Select specialization</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="family">Family Medicine</option>
                  <option value="internal">Internal Medicine</option>
                  <option value="neurology">Neurology</option>
                  <option value="obgyn">Obstetrics & Gynecology</option>
                  <option value="oncology">Oncology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="radiology">Radiology</option>
                  <option value="surgery">Surgery</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="jobType">
                  Employment Type <RequiredMark>*</RequiredMark>
                </Label>
                <Select id="jobType" name="jobType" required value={formData.jobType} onChange={handleChange}>
                  <option value="">Select employment type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="locum">Locum Tenens</option>
                  <option value="contract">Contract</option>
                  <option value="fellowship">Fellowship</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="experienceLevel">
                  Experience Level <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  id="experienceLevel"
                  name="experienceLevel"
                  required
                  value={formData.experienceLevel}
                  onChange={handleChange}
                >
                  <option value="">Select experience level</option>
                  <option value="resident">Resident</option>
                  <option value="fellow">Fellow</option>
                  <option value="attending">Attending</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid-Career (4-9 years)</option>
                  <option value="senior">Senior (10+ years)</option>
                  <option value="chief">Chief/Director Level</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="boardCertification">Board Certification</Label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input
                    type="checkbox"
                    id="boardCertification"
                    name="boardCertification"
                    checked={formData.boardCertification}
                    onChange={handleChange}
                  />
                  <label htmlFor="boardCertification">Board Certification Required</label>
                </div>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="salaryMin">
                  Minimum Salary <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  placeholder="e.g. 180000"
                  required
                  value={formData.salaryMin}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="salaryMax">
                  Maximum Salary <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  placeholder="e.g. 250000"
                  required
                  value={formData.salaryMax}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="jobDescription">
                Position Description <RequiredMark>*</RequiredMark>
              </Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Describe the clinical responsibilities, patient load, on-call expectations, etc."
                required
                value={formData.jobDescription}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="requirements">
                Qualifications & Requirements <RequiredMark>*</RequiredMark>
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="List required medical licenses, certifications, education, and experience..."
                required
                value={formData.requirements}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="benefits">
                Benefits & Compensation <RequiredMark>*</RequiredMark>
              </Label>
              <Textarea
                id="benefits"
                name="benefits"
                placeholder="List malpractice insurance, CME allowance, relocation assistance, loan repayment, etc."
                required
                value={formData.benefits}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="applicationDeadline">
                Application Deadline <RequiredMark>*</RequiredMark>
              </Label>
              <div style={{ position: "relative" }}>
                <Input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  required
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                />
                <FaCalendarAlt
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#6b7280",
                  }}
                />
              </div>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="contactEmail">
                  Contact Email <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="e.g. recruitment@hospital.org"
                  required
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
          </CardContent>
          <CardFooter>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Post Medical Position</Button>
          </CardFooter>
        </form>
      </Card>
    </FormContainer>
    </div>
  )
}

