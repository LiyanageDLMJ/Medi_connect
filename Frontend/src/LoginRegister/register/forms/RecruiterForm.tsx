import React from 'react';
import { InputGroup, Label, Input, Select } from '../../components/StyledFormComponents';

interface RecruiterFormProps {
  formData: {
    companyName?: string;
    position?: string;
    industryType?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const RecruiterForm: React.FC<RecruiterFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <InputGroup>
        <Label>Company Name</Label>
        <Input
          type="text"
          name="companyName"
          value={formData.companyName || ''}
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
        <Label>Industry Type</Label>
        <Select
          name="industryType"
          value={formData.industryType || ''}
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
