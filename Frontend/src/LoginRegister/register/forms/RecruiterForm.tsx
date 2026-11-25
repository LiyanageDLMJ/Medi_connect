import React from 'react';
import { InputGroup, Label, Input, Select } from '../../components/StyledFormComponents';

interface RecruiterFormProps {
  formData: {
    companyName?: string;
    companyType?: string;
    position?: string;
    contactNumber?: string;
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
        <Label>Company Type</Label>
        <Select
          name="companyType"
          value={formData.companyType || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Company Type</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="pharmaceutical">Pharmaceutical</option>
          <option value="other">Other</option>
        </Select>
      </InputGroup>
      <InputGroup>
        <Label>Contact Number</Label>
        <Input
          type="text"
          name="contactNumber"
          value={formData.contactNumber || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
    </>
  );
};

export default RecruiterForm;
