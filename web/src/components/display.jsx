import React, { useContext } from "react";
import { ThemeContext } from "../App";
import { maxCharsAtFullSize, maxPrecision, smallSize } from "../constants";
import Keyboard from "./keyboard";
import { evaluate } from "mathjs";

const Display = (props) => {
  const theme = useContext(ThemeContext);
  const { displayBody, calculatorDisplay, displayValue } = theme;

  const value = props.value;
  const pointAt = `${value}`.indexOf(".");
  const decimalValue = value.substring(pointAt, evaluate(value.length));
  const precisionWithFraction =
    pointAt === -1 ? 0 : evaluate(decimalValue.length - 1);
  let formattedValue = null;
  let scientificNotation = null;
  let fontSizeDown = null;

  formattedValue = parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: precisionWithFraction,
  });
  if (formattedValue === "NaN") {
    formattedValue = "Error";
  } else {
    if (formattedValue.length > maxPrecision - 1) {
      scientificNotation = parseFloat(value).toExponential(maxPrecision - 4); // Allow at least 4 characters (for scientific notation e.g. e+14) in the output string
      if (
        scientificNotation.substring(
          scientificNotation.length - 3,
          scientificNotation.length
        ) === "e+0"
      ) {
        scientificNotation = parseFloat(value).toExponential(maxPrecision - 1);
        scientificNotation = scientificNotation.substring(
          0,
          scientificNotation.length - 3
        );
      }
      formattedValue = scientificNotation;
      if (formattedValue === "NaN") {
        formattedValue = "Overflow\xA0Error";
      }
    }
  }

  fontSizeDown =
    ` ${formattedValue}`.length > maxCharsAtFullSize ? smallSize : 70;

  const display = displayValue.length >= 10 ? "Error" : displayValue;
  return (
    <div style={displayBody}>
      <div style={calculatorDisplay}>
        <div className="auto-scalling" style={{ fontSize: fontSizeDown }}>
          {display}
        </div>
      </div>
      <Keyboard />
    </div>
  );
};

export default Display;
