import React, { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../App";
import { digits, maxPrecision, operators } from "../constants";
import { evaluate } from "mathjs";

import Button from "./buttons";
const Keyboard = () => {
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [firstOperand, setFirstOperand] = useState("0");
  const [clearAll, setClearAll] = useState(true);

  const theme = useContext(ThemeContext);

  const { setDisplayValue, displayValue, row } = theme;

  const processDigit = useCallback(
    (newKeyValue) => {
      if (waitingForOperand) {
        setDisplayValue(`${newKeyValue}`);
        setWaitingForOperand(false);
        setClearAll(false);
      } else {
        let newDisplayValue =
          displayValue === "0"
            ? `${newKeyValue}`
            : `${displayValue}${newKeyValue}`;
        setDisplayValue(`${newDisplayValue}`);
        setWaitingForOperand(false);
        setClearAll(false);
      }
    },
    [displayValue, waitingForOperand, setDisplayValue]
  );

  const processOperator = useCallback(
    (newKeyValue) => {
      let newDisplayValue = null;
      let newOperator = null;
      let stringToEvaluate = null;

      if (firstOperand === "0" || operator == null || waitingForOperand) {
        setWaitingForOperand(true);
        setFirstOperand(displayValue);
        setOperator(newKeyValue);
        setOperator(newKeyValue);
        setClearAll(false);
        return;
      } else {
        stringToEvaluate = `${firstOperand}${operator}${displayValue}`;
        try {
          newDisplayValue = `${evaluate(stringToEvaluate)}`;
        } catch (e) {
          newDisplayValue = "Error";
        }
        if (newDisplayValue === "Infinity") {
          newDisplayValue = "Error";
        }
        newOperator = newKeyValue === "=" ? null : newKeyValue;
        setDisplayValue(`${newDisplayValue}`);
        setWaitingForOperand(true);
        setFirstOperand(`${newDisplayValue}`);
        setOperator(newOperator);
        setClearAll(false);
      }
    },
    [displayValue, firstOperand, operator, setDisplayValue, waitingForOperand]
  );

  const processPoint = useCallback(
    (newKeyValue) => {
      const needPoint = `${displayValue}`.indexOf(".") === -1 ? true : false;
      let newDisplayValue = null;

      if (waitingForOperand) {
        setDisplayValue("0.");
        setWaitingForOperand(false);
        setClearAll(false);
      } else {
        if (needPoint) {
          newDisplayValue = `${displayValue}${newKeyValue}`;
          setDisplayValue(`${newDisplayValue}`);
          setWaitingForOperand(false);
          setClearAll(false);
        }
      }
    },
    [displayValue, setDisplayValue, waitingForOperand]
  );

  const processPercentage = useCallback(() => {
    const newDisplayValue =
      parseFloat(displayValue).toPrecision(maxPrecision) / 100;
    setDisplayValue(`${newDisplayValue}`);
    setWaitingForOperand(false);
    setClearAll(false);
  }, [displayValue, setDisplayValue]);

  const processPlusMinusToggle = useCallback(() => {
    const newDisplayValue =
      parseFloat(displayValue).toPrecision(maxPrecision) * -1;
    setDisplayValue(`${newDisplayValue}`);
    setWaitingForOperand(false);
    setClearAll(false);
  }, [displayValue, setDisplayValue]);

  const processClear = useCallback(() => {
    if (clearAll) {
      setDisplayValue("0");
      setFirstOperand("0");
      setOperator(null);
      setWaitingForOperand(false);
      setClearAll(true);
    } else {
      setDisplayValue("0");
      setClearAll(true);
    }
  }, [clearAll, setDisplayValue]);

  const processUnknownKey = (newKeyValue) => {};

  const processFunctionKey = (newKeyValue) => {
    switch (newKeyValue) {
      case "C":
        processClear(newKeyValue);
        break;
      case "±":
        processPlusMinusToggle(newKeyValue);
        break;
      case ".":
        processPoint(newKeyValue);
        break;
      case "%":
        processPercentage(newKeyValue);
        break;
      default:
        processUnknownKey(newKeyValue);
    }
  };

  const handleClick = (value) => {
    processNewKey(`${value}`);
  };

  const processNewKey = (newKeyValue) => {
    const isDigit = digits.includes(newKeyValue);
    const isOperator = operators.includes(newKeyValue);

    if (isDigit) {
      processDigit(newKeyValue);
    } else {
      if (isOperator) {
        processOperator(newKeyValue);
      } else {
        processFunctionKey(newKeyValue);
      }
    }
  };

  return (
    <>
      <div style={row}>
        <Button title="AC" value="C" isWhite onClick={handleClick} />
        <Button value="±" title="±" isWhite onClick={handleClick} />
        <Button value="%" title="%" isWhite onClick={handleClick} />
        <Button value="/" title="&divide;" isBlue onClick={handleClick} />
      </div>
      <div style={row}>
        <Button value="7" title="7" isGray onClick={handleClick} />
        <Button value="8" title="8" isGray onClick={handleClick} />
        <Button value="9" title="9" isGray onClick={handleClick} />
        <Button value="*" title="&times;" isBlue onClick={handleClick} />
      </div>
      <div style={row}>
        <Button value="4" title="4" isGray onClick={handleClick} />
        <Button value="5" title="5" isGray onClick={handleClick} />
        <Button value="6" title="6" isGray onClick={handleClick} />
        <Button value="-" title="&ndash;" isBlue onClick={handleClick} />
      </div>
      <div style={row}>
        <Button value="1" title="1" isGray onClick={handleClick} />
        <Button value="2" title="2" isGray onClick={handleClick} />
        <Button value="3" title="3" isGray onClick={handleClick} />
        <Button value="+" title="+" isBlue onClick={handleClick} />
      </div>
      <div style={row}>
        <Button value="0" title="0" isGray onClick={handleClick} />
        <Button value="." title="." isGray onClick={handleClick} />
        <Button title=">" isGray onClick={handleClick} />
        <Button value="=" title="=" isBlue onClick={handleClick} />
      </div>
    </>
  );
};

export default Keyboard;
