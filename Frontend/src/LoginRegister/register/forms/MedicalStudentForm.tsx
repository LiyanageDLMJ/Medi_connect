import React from 'react';
import { InputGroup, Label, Input, Select } from '../../components/StyledFormComponents';

interface MedicalStudentFormProps {
  formData: {
    currentInstitute?: string;
    yearOfStudy?: string;
    fieldOfStudy?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const MedicalStudentForm: React.FC<MedicalStudentFormProps> = ({ formData, handleChange }) => {
  return (
    <>
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
        <Label>Field of Study</Label>
        <Input
          type="text"
          name="fieldOfStudy"
          value={formData.fieldOfStudy || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
    </>
  );
};

export default MedicalStudentForm;
