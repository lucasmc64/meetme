import React, { forwardRef } from "react";

const Input = forwardRef(({ label = null, ...props }, ref) => {
  return (
    <label ref={ref}>
      {label ? <span className="label">{label}</span> : null}

      <input {...props} />
    </label>
  );
});

export default Input;
