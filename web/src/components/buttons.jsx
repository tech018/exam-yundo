import React from "react";
import { styles } from "../styles";

const Button = ({ isBlue, isGray, isWhite, onClick, title, value }) => {
  const ClickButton = (e) => {
    e.preventDefault();
    onClick(`${e.target.value}`);
  };

  return (
    <button
      value={value}
      onClick={ClickButton}
      style={
        isBlue
          ? styles.btnBlue
          : isGray
          ? styles.btnGray
          : isWhite
          ? styles.btnLight
          : styles.btnLight
      }
    >
      {title}
    </button>
  );
};

export default Button;
