import React, { forwardRef } from "react";

import styles from "../styles/components/Button.module.css";

const Button = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <button ref={ref} className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  );
});

export default Button;
