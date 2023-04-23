import React, { useContext } from "react";

const ShelvesContext = React.createContext([]);
ShelvesContext.displayName = 'ShelvesContext';

export default ShelvesContext;

export function useShelves() {
    return useContext(ShelvesContext);
}

export const ShelvesProvider = ShelvesContext.Provider;
export const ShelvesConsumer = ShelvesContext.Consumer;
