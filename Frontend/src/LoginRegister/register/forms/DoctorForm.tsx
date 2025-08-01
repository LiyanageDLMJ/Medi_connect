import React from 'react';
import { InputGroup, Label, Input, RadioGroup, RadioWrapper, RadioInput, RadioLabel } from '../../components/StyledFormComponents';

interface DoctorFormProps {
  formData: {
    profession?: string;
    specialty?: string;
    location?: string;
    higherEducation?: string;
    otherSpecialty?: string; // Added for 'Other (please specify)'
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ formData, handleChange }) => {
  // Replace with the new 20 specialties
  const specialties = [
    'Neurosurgeon',
    'Cardiologist',
    'Oncologist',
    'Orthopedic Surgeon',
    'Cardiothoracic Surgeon',
    'Pediatrician',
    'Radiologist',
    'Dermatologist',
    'Psychiatrist',
    'Anesthesiologist',
    'Ophthalmologist',
    'Gastroenterologist',
    'Endocrinologist',
    'Emergency Medicine Physician',
    'Obstetrician/Gynecologist (OB-GYN)',
    'Family Medicine / General Practitioner',
    'Other (please specify)'
  ];

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
        <select
          name="specialty"
          value={formData.specialty || ''}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        >
          <option value="">Select a specialty</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
        {/* Show text input if 'Other (please specify)' is selected */}
        {formData.specialty === 'Other (please specify)' && (
          <Input
            type="text"
            name="otherSpecialty"
            placeholder="Please specify your specialty"
            value={formData.otherSpecialty || ''}
            onChange={handleChange}
            required
            style={{ marginTop: '8px' }}
          />
        )}
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
      <InputGroup>
        <Label>Doctor ID Photo</Label>
        <Input type="file" name="idPhoto" accept="image/*" onChange={handleChange} required />
      </InputGroup>
      <RadioGroup>
        <Label>Higher Education Interest</Label>
        <RadioWrapper style={{ gap: '2rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
            <RadioInput
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
            <RadioInput
              type="radio"
              name="higherEducation"
              value="no"
              checked={formData.higherEducation === 'no'}
              onChange={handleChange}
              style={{ accentColor: '#ef4444', width: 18, height: 18 }}
            />
            No
          </label>
        </RadioWrapper>
      </RadioGroup>
    </>
  );
};

export default DoctorForm;
