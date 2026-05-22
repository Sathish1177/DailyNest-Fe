import React from "react";

const SelectBox = ({
  label,
  name,
  value,
  onChange,
  options = [], // [{ value: 'x', label: 'X' }]
  error,
  required = false,
  disabled = false,
  className = "",
  placeholder = "Select an option"
}) => {
  return (
    <div className={`flex flex-col w-full mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat
          ${error 
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
            : "border-gray-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
          }
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default SelectBox;
