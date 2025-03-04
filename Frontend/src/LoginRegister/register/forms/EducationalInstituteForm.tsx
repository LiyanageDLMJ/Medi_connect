import React from 'react';
import { InputGroup, Label, Input, Select } from "../../components/StyledFormComponents";

interface EducationalInstituteFormProps {
  formData: {
    instituteName?: string;
    instituteType?: string;
    accreditation?: string;
    establishedYear?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const EducationalInstituteForm: React.FC<EducationalInstituteFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <InputGroup>
        <Label>Institute Name</Label>
        <Input
          type="text"
          name="instituteName"
          value={formData.instituteName || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <InputGroup>
        <Label>Institute Type</Label>
        <Select
          name="instituteType"
          value={formData.instituteType || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="medical_college">Medical College</option>
          <option value="nursing_school">Nursing School</option>
          <option value="dental_school">Dental School</option>
          <option value="other">Other</option>
        </Select>
      </InputGroup>
      <InputGroup>
        <Label>Accreditation</Label>
        <Input
          type="text"
          name="accreditation"
          value={formData.accreditation || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <InputGroup>
        <Label>Established Year</Label>
        <Input
          type="number"
          name="establishedYear"
          min="1800"
          max="2025"
          value={formData.establishedYear || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
    </>
  );
};

export default EducationalInstituteForm;
