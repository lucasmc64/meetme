import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label = null,
      selectDefaultText = "Selecione uma opção...",
      options = [],
      ...props
    },
    ref,
  ) => {
    return (
      <label ref={ref}>
        {label ? <span className="label">{label}</span> : null}

        <select {...props}>
          <option value="" disabled hidden>
            {selectDefaultText}
          </option>

          {options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </label>
    );
  },
);

export default Input;
