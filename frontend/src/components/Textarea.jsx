import React, { forwardRef } from "react";

const Textarea = forwardRef(({ label = null, ...props }, ref) => {
  return (
    <label ref={ref}>
      {label ? <span className="label">{label}</span> : null}

      <textarea {...props} />
    </label>
  );
});

export default Textarea;
