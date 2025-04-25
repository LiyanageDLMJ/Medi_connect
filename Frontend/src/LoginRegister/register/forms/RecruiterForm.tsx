import React from 'react';
import { InputGroup, Label, Input, Select } from '../../components/StyledFormComponents';

interface RecruiterFormProps {
  formData: {
    hospitalName?: string;
    position?: string;
    healthcareType?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const RecruiterForm: React.FC<RecruiterFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <InputGroup>
        <Label>Hospital Name</Label>
        <Input
          type="text"
          name="hospitalName"
          value={formData.hospitalName || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <InputGroup>
        <Label>Position</Label>
        <Input
          type="text"
          name="position"
          value={formData.position || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <InputGroup>
        <Label>Healthcare Type</Label>
        <Select
          name="healthcareType"
          value={formData.healthcareType || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Industry</option>
          <option value="healthcare">Healthcare</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="pharmaceutical">Pharmaceutical</option>
          <option value="other">Other</option>
        </Select>
      </InputGroup>
    </>
  );
};

export default RecruiterForm;
