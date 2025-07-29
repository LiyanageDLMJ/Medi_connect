import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChangePasswordPopup from './ChangePasswordPopup';
import { 
  validateEmail, 
  validateName, 
  validateMobileNumber, 
  validateCountry, 
  validateCity, 
  validateAddress,
  type ValidationResult 
} from '../../../../utils/validation';

interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  mobileNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  // Add other fields as needed
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  country?: string;
  city?: string;
  streetAddress?: string;
}

function ProfileForm() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Get email from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const email = user?.email;

  useEffect(() => {
    if (!email) {
      setError('No admin email found in localStorage.');
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get(`http://localhost:3000/api/admin/admins/${email}`)
      .then(res => {
        setProfile(res.data);
        setError(null);
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [email]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        const firstNameValidation = validateName(value, "First name");
        return firstNameValidation.isValid ? undefined : firstNameValidation.error;
      
      case "lastName":
        const lastNameValidation = validateName(value, "Last name");
        return lastNameValidation.isValid ? undefined : lastNameValidation.error;
      
      case "email":
        const emailValidation = validateEmail(value);
        return emailValidation.isValid ? undefined : emailValidation.error;
      
      case "mobileNumber":
        const mobileValidation = validateMobileNumber(value);
        return mobileValidation.isValid ? undefined : mobileValidation.error;
      
      case "country":
        const countryValidation = validateCountry(value);
        return countryValidation.isValid ? undefined : countryValidation.error;
      
      case "city":
        const cityValidation = validateCity(value);
        return cityValidation.isValid ? undefined : cityValidation.error;
      
      case "streetAddress":
        const addressValidation = validateAddress(value, "Street address");
        return addressValidation.isValid ? undefined : addressValidation.error;
      
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (): boolean => {
    if (!profile) return false;
    
    const newErrors: ValidationErrors = {};
    
    Object.keys(profile).forEach(key => {
      if (key !== 'email' && key !== 'username') { // Skip email validation as it's disabled
        const value = profile[key as keyof AdminProfile];
        if (typeof value === 'string') {
          const error = validateField(key, value);
          if (error) {
            newErrors[key as keyof ValidationErrors] = error;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Mark all fields as touched
    const allTouched = Object.keys(profile).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      // Only include password if changed
      const updateData: any = { ...profile };
      if (password) updateData.password = password;
      
      await axios.put(`http://localhost:3000/api/admin/admins/${email}`, updateData);
      setSuccess(true);
      setPassword('');
      setErrors({});
      setTouched({});
    } catch (err: any) {
      console.error(err);
      
      if (err.response?.data?.errors) {
        // Handle backend validation errors
        const backendErrors = err.response.data.errors;
        if (Array.isArray(backendErrors)) {
          setError(`Validation failed:\n${backendErrors.join('\n')}`);
        } else {
          setError(err.response.data.message || 'Failed to update profile.');
        }
      } else {
        setError(err.message || 'Failed to update profile.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password change handler
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    // Call backend endpoint for password change
    try {
      await axios.post(`http://localhost:3000/api/admin/admins/${email}/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (err: any) {
      // Throw error to popup
      throw new Error(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6";
    const errorClasses = "outline-red-500 focus:outline-red-500";
    const successClasses = "outline-green-500 focus:outline-green-500";
    
    if (errors[fieldName as keyof ValidationErrors]) {
      return `${baseClasses} ${errorClasses}`;
    } else if (touched[fieldName] && profile && profile[fieldName as keyof AdminProfile]) {
      return `${baseClasses} ${successClasses}`;
    }
    return baseClasses;
  };

  if (loading) return <div className="p-4 text-blue-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!profile) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-900">First name</label>
              <div className="mt-2">
                <input 
                  type="text" 
                  name="firstName" 
                  id="firstName" 
                  value={profile.firstName} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-900">Last name</label>
              <div className="mt-2">
                <input 
                  type="text" 
                  name="lastName" 
                  id="lastName" 
                  value={profile.lastName} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
              <div className="mt-2">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profile.email} 
                  disabled 
                  className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>
          
            <div className="sm:col-span-3">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={profile ? '********' : ''}
                  disabled
                  className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <button 
                  type="button" 
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                  onClick={() => setShowChangePassword(true)}
                >
                  Change
                </button>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="mobileNumber" className="block text-sm/6 font-medium text-gray-900">Mobile Number</label>
              <div className="mt-2">
                <input 
                  type="text" 
                  name="mobileNumber" 
                  id="mobileNumber" 
                  value={profile.mobileNumber} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("mobileNumber")}
                  placeholder="e.g., (555) 123-4567"
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Residence Information</h2>
          <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3 ">
              <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">Country</label>
              <div className="mt-2 grid grid-cols-1">
                <select 
                  id="country" 
                  name="country" 
                  value={profile.country} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("country")}
                >
                  <option value="">Select a country</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Australia">Australia</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="India">India</option>
                  <option value="Brazil">Brazil</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Other">Other</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">City</label>
              <div className="mt-2">
                <input 
                  type="text" 
                  name="city" 
                  id="city" 
                  value={profile.city} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("city")}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>
            <div className="col-span-full">
              <label htmlFor="streetAddress" className="block text-sm/6 font-medium text-gray-900">Street address</label>
              <div className="mt-2">
                <input 
                  type="text" 
                  name="streetAddress" 
                  id="streetAddress" 
                  value={profile.streetAddress} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("streetAddress")}
                />
                {errors.streetAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        {success && <span className="text-green-600 ml-4">Profile updated successfully!</span>}
        {error && <span className="text-red-600 ml-4">{error}</span>}
      </div>
      {showChangePassword && (
        <ChangePasswordPopup
          onClose={() => setShowChangePassword(false)}
          // onChangePassword={handleChangePassword}
        />
      )}
    </form>
  );
}

export default ProfileForm;
