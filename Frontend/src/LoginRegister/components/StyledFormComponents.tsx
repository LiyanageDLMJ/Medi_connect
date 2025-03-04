import styled from 'styled-components';

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #333;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #2E5FB7;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #2E5FB7;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #2E5FB7;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const RadioInput = styled.input`
  margin: 0;
`;

export const RadioLabel = styled.label`
  color: #333;
  margin-right: 1rem;
`;
