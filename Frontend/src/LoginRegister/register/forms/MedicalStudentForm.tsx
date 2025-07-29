import React from 'react';
import { InputGroup, Label, Input, Select } from '../../components/StyledFormComponents';

interface MedicalStudentFormProps {
  formData: {
    currentInstitute?: string;
    yearOfStudy?: string;
    fieldOfStudy?: string;
    higherEducation?: string;
    otherFieldOfStudy?: string; // Added for 'Other (please specify)'
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const MedicalStudentForm: React.FC<MedicalStudentFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <InputGroup>
        <Label>Name</Label>
        <Input
          type="text"
          name="name"
          value={(formData as any).name || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label>Age</Label>
        <Input
          type="number"
          name="age"
          value={(formData as any).age || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label>Current Institute</Label>
        <Input
          type="text"
          name="currentInstitute"
          value={formData.currentInstitute || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <InputGroup>
        <Label>Year of Study</Label>
        <Select
          name="yearOfStudy"
          value={formData.yearOfStudy || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Year</option>
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
          <option value="4">Fourth Year</option>
          <option value="5">Fifth Year</option>
        </Select>
      </InputGroup>
      <InputGroup>
        <Label>Medical Student ID Photo</Label>
        <Input type="file" name="idPhoto" accept="image/*" onChange={handleChange} required />
      </InputGroup>
      <InputGroup>
        <Label>Field of Study</Label>
        <Select
          name="fieldOfStudy"
          value={formData.fieldOfStudy || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select a field of study</option>
          <option value="Neurosurgery">Neurosurgery</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Oncology">Oncology</option>
          <option value="Orthopedic Surgery">Orthopedic Surgery</option>
          <option value="Cardiothoracic Surgery">Cardiothoracic Surgery</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Radiology">Radiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Anesthesiology">Anesthesiology</option>
          <option value="Ophthalmology">Ophthalmology</option>
          <option value="Gastroenterology">Gastroenterology</option>
          <option value="Endocrinology">Endocrinology</option>
          <option value="Emergency Medicine">Emergency Medicine</option>
          <option value="Obstetrics and Gynecology (OB-GYN)">Obstetrics and Gynecology (OB-GYN)</option>
          <option value="Family Medicine / General Practice">Family Medicine / General Practice</option>
          <option value="Other (please specify)">Other (please specify)</option>
        </Select>
        {/* Show text input if 'Other (please specify)' is selected */}
        {formData.fieldOfStudy === 'Other (please specify)' && (
          <Input
            type="text"
            name="otherFieldOfStudy"
            placeholder="Please specify your field of study"
            value={formData.otherFieldOfStudy || ''}
            onChange={handleChange}
            required
            style={{ marginTop: '8px' }}
          />
        )}
      </InputGroup>
      <div style={{ marginTop: '1.2rem' }}>
        <Label>Higher Education Interest</Label>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
            <input
              type="radio"
              name="higherEducation"
              value="yes"
              checked={formData.higherEducation === 'yes'}
              onChange={handleChange}
              style={{ accentColor: '#184389', width: 18, height: 18 }}
            />
            Yes
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
            <input
              type="radio"
              name="higherEducation"
              value="no"
              checked={formData.higherEducation === 'no'}
              onChange={handleChange}
              style={{ accentColor: '#ef4444', width: 18, height: 18 }}
            />
            No
          </label>
        </div>
      </div>
    </>
  );
};

export default MedicalStudentForm;
