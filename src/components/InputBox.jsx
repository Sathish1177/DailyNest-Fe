import React from "react";

const InputBox = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none transition-all duration-200
          ${error 
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
            : "border-gray-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
          }
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default InputBox;
