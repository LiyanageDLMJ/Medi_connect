import axios from "axios";
import React, { useState } from "react";

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  conpassword?: string;
  mobileNumber?: string;
  country?: string;
  city?: string;
  streetAddress?: string;
}

function RegisterAdmin() {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    conpassword: "",
    mobileNumber: "",
    country: "",
    city: "",
    streetAddress: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters long";
        if (value.length > 50) return "First name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "First name can only contain letters and spaces";
        break;
      
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters long";
        if (value.length > 50) return "Last name cannot exceed 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Last name can only contain letters and spaces";
        break;
      
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        break;
      
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters long";
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(value)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        }
        break;
      
      case "conpassword":
        if (!value) return "Confirm password is required";
        if (value !== inputs.password) return "Passwords do not match";
        break;
      
      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required";
        const mobileRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
        if (!mobileRegex.test(value)) return "Please enter a valid mobile number";
        break;
      
      case "country":
        if (!value.trim()) return "Country is required";
        if (value.length < 2) return "Country must be at least 2 characters long";
        if (value.length > 50) return "Country cannot exceed 50 characters";
        break;
      
      case "city":
        if (!value.trim()) return "City is required";
        if (value.length < 2) return "City must be at least 2 characters long";
        if (value.length > 50) return "City cannot exceed 50 characters";
        break;
      
      case "streetAddress":
        if (!value.trim()) return "Street address is required";
        if (value.length < 5) return "Street address must be at least 5 characters long";
        if (value.length > 200) return "Street address cannot exceed 200 characters";
        break;
    }
    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

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
    const newErrors: ValidationErrors = {};
    
    Object.keys(inputs).forEach(key => {
      const error = validateField(key, inputs[key as keyof typeof inputs]);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendRequest = async () => {
    return await axios
      .post("http://localhost:3000/api/admin/adminsignup", {
        firstName: inputs.firstName.trim(),
        lastName: inputs.lastName.trim(),
        email: inputs.email.trim(),
        password: inputs.password,
        conpassword: inputs.conpassword,
        mobileNumber: inputs.mobileNumber.trim(),
        country: inputs.country.trim(),
        city: inputs.city.trim(),
        streetAddress: inputs.streetAddress.trim(),
      })
      .then((res) => res.data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(inputs).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await sendRequest();
      alert("Admin registered successfully!");
      console.log("Response:", data);
      
      // Reset form
      setInputs({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        conpassword: "",
        mobileNumber: "",
        country: "",
        city: "",
        streetAddress: "",
      });
      setErrors({});
      setTouched({});
    } catch (err: any) {
      console.error(err);
      
      if (err.response?.data?.errors) {
        // Handle backend validation errors
        const backendErrors = err.response.data.errors;
        if (Array.isArray(backendErrors)) {
          alert(`Validation failed:\n${backendErrors.join('\n')}`);
        } else {
          alert(`Error: ${err.response.data.message || 'Registration failed'}`);
        }
      } else {
        alert(`Error: ${err.message || 'Registration failed'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm";
    const errorClasses = "outline-red-500 focus:outline-red-500";
    const successClasses = "outline-green-500 focus:outline-green-500";
    
    if (errors[fieldName as keyof ValidationErrors]) {
      return `${baseClasses} ${errorClasses}`;
    } else if (touched[fieldName] && inputs[fieldName as keyof typeof inputs]) {
      return `${baseClasses} ${successClasses}`;
    }
    return baseClasses;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {/* Mandatory Information */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">
            Mandatory Information
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* First Name */}
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="firstName"
                  id="first-name"
                  value={inputs.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="lastName"
                  id="last-name"
                  value={inputs.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="sm:col-span-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={inputs.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={inputs.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must contain at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="sm:col-span-2">
              <label
                htmlFor="conpassword"
                className="block text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                  <input
                    type="password"
                    name="conpassword"
                    id="conpassword"
                    value={inputs.conpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                    placeholder="Confirm password"
                  />
                </div>
                {errors.conpassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.conpassword}</p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div className="sm:col-span-2">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-900"
              >
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="mobileNumber"
                  id="mobileNumber"
                  value={inputs.mobileNumber}
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

        {/* Residence Information */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">
            Residence Information
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Country */}
            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-900"
              >
                Country
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="country"
                  name="country"
                  value={inputs.country}
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

            {/* City */}
            <div className="sm:col-span-3">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={inputs.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("city")}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Street Address */}
            <div className="sm:col-span-full">
              <label
                htmlFor="streetAddress"
                className="block text-sm font-medium text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="streetAddress"
                  id="streetAddress"
                  value={inputs.streetAddress}
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

        {/* Form Actions */}
        <div className="mt-6 flex items-center justify-end gap-x-2">
          <button
            type="reset"
            onClick={() => {
              setInputs({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                conpassword: "",
                mobileNumber: "",
                country: "",
                city: "",
                streetAddress: "",
              });
              setErrors({});
              setTouched({});
            }}
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isSubmitting ? "Registering..." : "Register Admin"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default RegisterAdmin;
