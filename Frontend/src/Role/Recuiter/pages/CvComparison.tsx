"use client"

import { useState, useMemo, useEffect } from "react"
import styled from "styled-components"
import {
  FaSearch,
  FaUser,
  FaGraduationCap,
  FaStethoscope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaAward,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaCheck,
} from "react-icons/fa"
import Sidebar from "../components/NavBar/Sidebar";
import { useFormContext } from "../../../context/FormContext";
import axios from "axios";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #2563eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const NavLink = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  color: ${(props) => (props.active ? "#2563eb" : "#374151")};
  background-color: ${(props) => (props.active ? "#eff6ff" : "transparent")};
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`

const MaxWidthContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 2rem;
`

const Card = styled.div<{ variant?: string }>`
  background-color: ${(props) => (props.variant === "success" ? "#f0fdf4" : "white")};
  border: 1px solid ${(props) => (props.variant === "success" ? "#bbf7d0" : "#e5e7eb")};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 0 1.5rem;
`

const CardTitle = styled.h3<{ color?: string }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.color || "#111827"};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CardDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`

const CardContent = styled.div`
  padding: 1.5rem;
`

const Grid = styled.div<{ cols?: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.cols === 1
      ? "1fr"
      : props.cols === 2
        ? "repeat(2, 1fr)"
        : props.cols === 3
          ? "repeat(3, 1fr)"
          : "repeat(auto-fit, minmax(300px, 1fr))"};
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`

const InputWrapper = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  padding-left: ${(props) => (props.type === "search" ? "2.5rem" : "0.75rem")};
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.875rem;
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
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

const Button = styled.button<{ variant?: string; size?: string; disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${(props) => (props.size === "sm" ? "0.25rem 0.75rem" : "0.5rem 1rem")};
  font-size: ${(props) => (props.size === "sm" ? "0.875rem" : "0.875rem")};
  font-weight: 500;
  border-radius: 0.375rem;
  border: ${(props) => (props.variant === "outline" ? "1px solid #d1d5db" : "none")};
  background-color: ${(props) =>
    props.variant === "outline"
      ? "white"
      : props.variant === "ghost"
        ? "transparent"
        : props.disabled
          ? "#9ca3af"
          : "#2563eb"};
  color: ${(props) => (props.variant === "outline" ? "#374151" : props.variant === "ghost" ? "#374151" : "white")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? "#9ca3af"
        : props.variant === "outline"
          ? "#f3f4f6"
          : props.variant === "ghost"
            ? "#f3f4f6"
            : "#1d4ed8"};
  }
`

const Badge = styled.span<{ variant?: string; highlight?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: ${(props) => (props.variant === "outline" ? "1px solid #d1d5db" : "none")};
  background-color: ${(props) =>
    props.highlight ? "#dcfce7" : props.variant === "outline" ? "transparent" : "#f3f4f6"};
  color: ${(props) => (props.highlight ? "#166534" : props.variant === "outline" ? "#374151" : "#374151")};
  border-color: ${(props) => (props.highlight ? "#bbf7d0" : "#d1d5db")};
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
`

const CandidateCard = styled(Card)<{ selected?: boolean }>`
  transition: all 0.2s;
  border: ${(props) => (props.selected ? "2px solid #2563eb" : "1px solid #e5e7eb")};
  background-color: ${(props) => (props.selected ? "#eff6ff" : "white")};

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  margin-top: 0.25rem;
`

const FlexContainer = styled.div<{ justify?: string; align?: string; gap?: string; wrap?: boolean }>`
  display: flex;
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "flex-start"};
  gap: ${(props) => props.gap || "0.5rem"};
  flex-wrap: ${(props) => (props.wrap ? "wrap" : "nowrap")};
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
`

const Separator = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
`

const CVSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
`

const CVFileContainer = styled.div`
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.375rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`

// Helper function to find common elements between candidates
const findCommonElements = (candidates: any[]) => {
  if (candidates.length < 2) return {}

  const commonSkills = candidates[0].skills.filter((skill: string) =>
    candidates.every((candidate) => candidate.skills.includes(skill)),
  )

  const commonCertifications = candidates[0].certifications.filter((cert: string) =>
    candidates.every((candidate) => candidate.certifications.includes(cert)),
  )

  const commonSpecialty = candidates.every((candidate) => candidate.specialty === candidates[0].specialty)
    ? candidates[0].specialty
    : null

  const commonGraduationYear = candidates.every(
    (candidate) => candidate.graduationYear === candidates[0].graduationYear,
  )
    ? candidates[0].graduationYear
    : null

  return {
    skills: commonSkills,
    certifications: commonCertifications,
    specialty: commonSpecialty,
    graduationYear: commonGraduationYear,
  }
}

function truncateFileName(name: string, maxLength: number = 25) {
  if (!name) return "";
  if (name.length <= maxLength) return name;
  const ext = name.split('.').pop();
  return name.slice(0, 10) + "..." + name.slice(-8);
}

// ---------------------------
// PDF helpers ---------------
// ---------------------------

/**
 * Opens the candidate PDF in a new tab for quick preview.
 * Ensures Cloudinary serves the raw PDF instead of trying to transform it as an image.
 */
const handlePreviewPDF = (candidate: any) => {
  const baseUrl: string | undefined =
    candidate.resumeImageUrl || candidate.cvFile?.url || candidate.resumeDownloadUrl;

  if (!baseUrl) {
    console.error("No PDF URL found for preview");
    alert("PDF not available for preview");
    return;
  }

  const previewUrl = baseUrl;
  window.open(previewUrl, "_blank", "noopener,noreferrer");
};

/**
 * Downloads the candidate PDF using fetch + blob to avoid CORS/download issues.
 */
const handleDownloadPDF = async (candidate: any) => {
  const baseUrl: string | undefined =
    candidate.resumeDownloadUrl || candidate.resumeImageUrl || candidate.cvFile?.url;

  if (!baseUrl) {
    console.error("No PDF URL found for download");
    alert("PDF not available for download");
    return;
  }

  const downloadUrl = baseUrl;
  const fileName = candidate.cvFile?.name || `${candidate.name || "candidate"}_CV.pdf`;

  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status}`);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (err) {
    console.error("PDF download error", err);
    alert("Failed to download PDF. Please try again later.");
  }
};

export default function CVComparison() {
  const [isLoading, setIsLoading] = useState(true);
  const [candidatesSource, setCandidatesSource] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [graduationYears, setGraduationYears] = useState<string[]>([]);

  // fetch when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch candidates
        const candidatesRes = await axios.get("http://localhost:3000/api/recruiter/candidates");
        const formattedCandidates = candidatesRes.data.data.map((candidate: any) => ({
          id: candidate._id,
          name: candidate.yourName,
          specialty: candidate.specialization,
          graduationYear: candidate.graduationDate ? 
            new Date(candidate.graduationDate).getFullYear() : 'N/A',
          university: candidate.university,
          experience: candidate.experience,
          location: candidate.currentLocation,
          certifications: candidate.certificationInput || [],
          skills: (candidate.careerSummary || "").split(",")
                         .map((t: string) => t.trim())
                         .filter(Boolean),
          cvFile: {
            name: candidate.resumePdfUrl?.split("/").pop() || "CV.pdf",
            uploadDate: new Date(candidate.updatedAt || candidate.createdAt).toLocaleDateString(),
            size: "-",
            url: candidate.resumePdfUrl,
          },
          resumePdfUrl: candidate.resumePdfUrl,
          resumeDownloadUrl: candidate.resumeDownloadUrl,
        }));
        setCandidatesSource(formattedCandidates);

        // Fetch specialties
        const specsRes = await axios.get("http://localhost:3000/api/recruiter/candidates/specialties");
        setSpecialties(["All Specialties", ...specsRes.data.data]);

        // Fetch graduation years
        const yearsRes = await axios.get("http://localhost:3000/api/recruiter/candidates/years");
        setGraduationYears(["All Years", ...yearsRes.data.data]);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [selectedGraduationYear, setSelectedGraduationYear] = useState("All Years")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const filteredCandidates = candidatesSource.filter((candidate) => {
    const matchesSpecialty = selectedSpecialty === "All Specialties" || candidate.specialty === selectedSpecialty
    const matchesYear =
      selectedGraduationYear === "All Years" || candidate.graduationYear.toString() === selectedGraduationYear
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSpecialty && matchesYear && matchesSearch
  })

  const handleCandidateSelect = (candidate: any) => {
    if (selectedCandidates.find((c) => c.id === candidate.id)) {
      setSelectedCandidates(selectedCandidates.filter((c) => c.id !== candidate.id))
    } else if (selectedCandidates.length < 3) {
      setSelectedCandidates([...selectedCandidates, candidate])
    }
  }

  const handleCompare = () => {
    if (selectedCandidates.length >= 2) {
      setShowComparison(true)
    }
  }

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <MainContent>
        <MaxWidthContainer>
          <Title>Enhanced CV Comparison</Title>

          {!showComparison ? (
            <>
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Candidates</CardTitle>
                  <CardDescription>
                    Search and filter medical professionals by specialty and graduation year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p>Loading candidates...</p>
                  ) : (
                    <>
                      <Grid cols={4}>
                        <FormGroup>
                          <Label htmlFor="search">Search by Name</Label>
                          <InputWrapper>
                            <SearchIcon />
                            <Input
                              id="search"
                              type="search"
                              placeholder="Enter candidate name..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </InputWrapper>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="specialty">Medical Specialty</Label>
                          <Select
                            id="specialty"
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                          >
                            {specialties.map((s, idx) => (
                              <option key={s + idx} value={s}>
                                {s}
                              </option>
                            ))}
                          </Select>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="graduationYear">Graduation Year</Label>
                          <Select
                            id="graduationYear"
                            value={selectedGraduationYear}
                            onChange={(e) => setSelectedGraduationYear(e.target.value)}
                          >
                            {graduationYears.map((y, idx) => (
                              <option key={y + idx} value={y}>
                                {y}
                              </option>
                            ))}
                          </Select>
                        </FormGroup>
                        <FormGroup>
                          <Label> </Label>
                          <Button onClick={handleCompare} disabled={selectedCandidates.length !== 2}>
                            Compare Selected ({selectedCandidates.length})
                          </Button>
                        </FormGroup>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Selected Candidates */}
              {selectedCandidates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected for Comparison ({selectedCandidates.length}/3)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FlexContainer wrap gap="0.5rem" style={{ marginBottom: "1rem" }}>
                      {selectedCandidates.map((candidate) => (
                        <Badge key={candidate.id} onClick={() => handleCandidateSelect(candidate)}>
                          {candidate.name} ✕
                        </Badge>
                      ))}
                    </FlexContainer>
                    <Button onClick={handleCompare} disabled={selectedCandidates.length < 2}>
                      Compare Selected Candidates
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Candidate List */}
              <Grid>
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    selected={selectedCandidates.find((c) => c.id === candidate.id) !== undefined}
                  >
                    <CardHeader>
                      <FlexContainer justify="space-between" align="flex-start">
                        <FlexContainer align="center" gap="0.75rem">
                          <Checkbox
                            type="checkbox"
                            checked={selectedCandidates.some((c) => c.id === candidate.id)}
                            onChange={() => handleCandidateSelect(candidate)}
                          />
                          <div>
                            <CardTitle>
                              <FaUser />
                              {candidate.name}
                            </CardTitle>
                            <Badge variant="outline">{candidate.specialty}</Badge>
                          </div>
                        </FlexContainer>
                      </FlexContainer>
                    </CardHeader>
                    <CardContent>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <InfoItem>
                          <FaCalendarAlt color="#6b7280" />
                          <span>Graduated: {candidate.graduationYear}</span>
                        </InfoItem>
                        <InfoItem>
                          <FaGraduationCap color="#6b7280" />
                          <span>{candidate.university}</span>
                        </InfoItem>
                        <InfoItem>
                          <FaMapMarkerAlt color="#6b7280" />
                          <span>{candidate.location}</span>
                        </InfoItem>
                        <InfoItem>
                          <FaAward color="#6b7280" />
                          <span>{candidate.experience} experience</span>
                        </InfoItem>

                        {/* CV File Section */}
                        <CVSection>
                          <InfoItem style={{ marginBottom: "0.5rem" }}>
                            <FaFileAlt color="#6b7280" />
                            <span style={{ fontWeight: "500" }}>CV Document</span>
                          </InfoItem>
                          <CVFileContainer>
                            <FlexContainer justify="space-between" align="center">
                              <div>
                                <p style={{ fontSize: "0.75rem", fontWeight: "500", margin: 0 }}>
                                  {truncateFileName(candidate.cvFile.name)}
                                </p>
                                {/* <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                                  {candidate.cvFile.size} • Updated {candidate.cvFile.uploadDate}
                                </p> */}
                              </div>
                              <FlexContainer gap="0.25rem">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => { e.stopPropagation(); handlePreviewPDF(candidate); }}
                                  style={{ padding: "0.25rem", width: "2rem", height: "2rem" }}
                                  title="Preview PDF"
                                >
                                  <FaEye size={12} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => { e.stopPropagation(); handleDownloadPDF(candidate); }}
                                  style={{ padding: "0.25rem", width: "2rem", height: "2rem" }}
                                  title="Download PDF"
                                >
                                  <FaDownload size={12} />
                                </Button>
                              </FlexContainer>
                            </FlexContainer>
                          </CVFileContainer>
                        </CVSection>
                      </div>
                    </CardContent>
                  </CandidateCard>
                ))}
              </Grid>

              {filteredCandidates.length === 0 && (
                <Card>
                  <CardContent>
                    <EmptyState>No candidates found matching your criteria.</EmptyState>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            /* Comparison View */
            <div>
              <FlexContainer justify="space-between" align="center" style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>Candidate Comparison</h2>
                <Button variant="outline" onClick={() => setShowComparison(false)}>
                  Back to Search
                </Button>
              </FlexContainer>

              {/* Common Features Summary */}
              {(() => {
                const commonFeatures = findCommonElements(selectedCandidates)
                const hasCommonFeatures =
                  (commonFeatures.skills?.length ?? 0) > 0 ||
                  (commonFeatures.certifications?.length ?? 0) > 0 ||
                  commonFeatures.specialty ||
                  commonFeatures.graduationYear

                return (
                  hasCommonFeatures && (
                    <Card variant="success">
                      <CardHeader>
                        <CardTitle color="#166534">
                          <FaCheck />
                          Common Features Found
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Grid cols={2}>
                          {commonFeatures.specialty && (
                            <div>
                              <h4 style={{ fontWeight: "600", color: "#166534", marginBottom: "0.25rem" }}>
                                Specialty
                              </h4>
                              <Badge highlight>{commonFeatures.specialty}</Badge>
                            </div>
                          )}
                          {commonFeatures.graduationYear && (
                            <div>
                              <h4 style={{ fontWeight: "600", color: "#166534", marginBottom: "0.25rem" }}>
                                Graduation Year
                              </h4>
                              <Badge highlight>{commonFeatures.graduationYear}</Badge>
                            </div>
                          )}
                          {(commonFeatures.certifications?.length ?? 0) > 0 && (
                            <div>
                              <h4 style={{ fontWeight: "600", color: "#166534", marginBottom: "0.25rem" }}>
                                Common Certifications
                              </h4>
                              <FlexContainer wrap gap="0.25rem">
                                {(commonFeatures.certifications ?? []).map((cert: string, i: number) => (
                                  <Badge key={i} highlight>
                                    {cert}
                                  </Badge>
                                ))}
                              </FlexContainer>
                            </div>
                          )}
                          {(commonFeatures.skills?.length ?? 0) > 0 && (
                            <div>
                              <h4 style={{ fontWeight: "600", color: "#166534", marginBottom: "0.25rem" }}>
                                Common Skills
                              </h4>
                              <FlexContainer wrap gap="0.25rem">
                                {(commonFeatures.skills ?? []).map((skill: string, i: number) => (
                                  <Badge key={i} highlight>
                                    {skill}
                                  </Badge>
                                ))}
                              </FlexContainer>
                            </div>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  )
                )
              })()}

              <Grid>
                {selectedCandidates.map((candidate) => {
                  const commonFeatures = findCommonElements(selectedCandidates)

                  return (
                    <Card key={candidate.id}>
                      <CardHeader>
                        <CardTitle>{candidate.name}</CardTitle>
                        <Badge variant="outline" highlight={commonFeatures.specialty === candidate.specialty}>
                          {candidate.specialty}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div>
                            <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Education</h4>
                            <p style={{ fontSize: "0.875rem", color: "#4b5563", margin: 0 }}>{candidate.university}</p>
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color:
                                  commonFeatures.graduationYear === candidate.graduationYear ? "#166534" : "#4b5563",
                                fontWeight:
                                  commonFeatures.graduationYear === candidate.graduationYear ? "500" : "normal",
                                backgroundColor:
                                  commonFeatures.graduationYear === candidate.graduationYear
                                    ? "#f0fdf4"
                                    : "transparent",
                                padding:
                                  commonFeatures.graduationYear === candidate.graduationYear ? "0.25rem 0.5rem" : "0",
                                borderRadius:
                                  commonFeatures.graduationYear === candidate.graduationYear ? "0.25rem" : "0",
                                margin: 0,
                              }}
                            >
                              Graduated: {candidate.graduationYear}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Experience & Location</h4>
                            <p style={{ fontSize: "0.875rem", color: "#4b5563", margin: 0 }}>{candidate.experience}</p>
                            <p style={{ fontSize: "0.875rem", color: "#4b5563", margin: 0 }}>{candidate.location}</p>
                          </div>

                          <Separator />

                          <div>
                            <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Certifications</h4>
                            <FlexContainer wrap gap="0.25rem">
                              {candidate.certifications.map((cert: string, i: number) => (
                                <Badge key={i} highlight={commonFeatures.certifications?.includes(cert)}>
                                  {cert}
                                </Badge>
                              ))}
                            </FlexContainer>
                          </div>

                          <Separator />

                          <div>
                            <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Key Skills</h4>
                            <FlexContainer wrap gap="0.25rem">
                              {candidate.skills.map((skill: string, i: number) => (
                                <Badge key={i} variant="outline" highlight={commonFeatures.skills?.includes(skill)}>
                                  {skill}
                                </Badge>
                              ))}
                            </FlexContainer>
                          </div>

                          <Separator />

                          {/* CV Download Section */}
                          <div>
                            <h4 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>CV Document</h4>
                            <CVFileContainer>
                              <FlexContainer justify="space-between" align="center">
                                <div>
                                  <p style={{ fontSize: "0.875rem", fontWeight: "500", margin: 0 }}>
                                    {truncateFileName(candidate.cvFile.name)}
                                  </p>
                                  <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                                    {candidate.cvFile.size} • Updated {candidate.cvFile.uploadDate}
                                  </p>
                                </div>
                                <FlexContainer gap="0.5rem">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handlePreviewPDF(candidate)}
                                    title="Preview PDF"
                                  >
                                    <FaEye size={12} />
                                    View
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleDownloadPDF(candidate)}
                                    title="Download PDF"
                                  >
                                    <FaDownload size={12} />
                                    Download
                                  </Button>
                                </FlexContainer>
                              </FlexContainer>
                            </CVFileContainer>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </Grid>
            </div>
          )}
        </MaxWidthContainer>
      </MainContent>
    </Container>
  )
}