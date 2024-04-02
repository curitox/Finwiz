// BottomSheetContext.js
import React, { createContext, useContext, useState } from "react";

const BottomSheetContext = createContext(null);

export const useBottomSheetContext = () => useContext(BottomSheetContext);

export const BottomSheetProvider = ({ children }) => {
  const [openBottomSheet, setOpenBottomSheet] = useState({
    open: false,
    content: null,
  });

  return (
    <BottomSheetContext.Provider
      value={{ openBottomSheet, setOpenBottomSheet }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetContext;
