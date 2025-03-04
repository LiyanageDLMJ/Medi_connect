import React from 'react';
import { InputGroup, Label, Input, RadioGroup, RadioWrapper, RadioInput, RadioLabel } from '../../components/StyledFormComponents';

interface DoctorFormProps {
  formData: {
    profession?: string;
    specialty?: string;
    location?: string;
    higherEducation?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <InputGroup>
        <Label>Profession</Label>
        <Input
          type="text"
          name="profession"
          value={formData.profession || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <InputGroup>
        <Label>Specialty</Label>
        <Input
          type="text"
          name="specialty"
          value={formData.specialty || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <InputGroup>
        <Label>Location</Label>
        <Input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <RadioGroup>
        <Label>Higher Education</Label>
        <RadioWrapper>
          <RadioInput
            type="radio"
            name="higherEducation"
            value="yes"
            onChange={handleChange}
          />
          <RadioLabel>Yes</RadioLabel>
          <RadioInput
            type="radio"
            name="higherEducation"
            value="no"
            onChange={handleChange}
          />
          <RadioLabel>No</RadioLabel>
        </RadioWrapper>
      </RadioGroup>
    </>
  );
};

export default DoctorForm;
