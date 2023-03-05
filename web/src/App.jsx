import React, { useState } from "react";
import Display from "./components/display";
import { styles } from "./styles";
import { createContext } from "react";

export const ThemeContext = createContext(styles);

const App = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const { container } = styles;
  return (
    <ThemeContext.Provider value={{ ...styles, displayValue, setDisplayValue }}>
      <div style={container}>
        <Display value={displayValue} />
      </div>
    </ThemeContext.Provider>
  );
};
export default App;
