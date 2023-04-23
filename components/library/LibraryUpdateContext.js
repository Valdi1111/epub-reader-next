import React, { useContext } from "react";

const LibraryUpdateContext = React.createContext({});
LibraryUpdateContext.displayName = 'LibraryUpdateContext';

export default LibraryUpdateContext;

export function useLibraryUpdate() {
    return useContext(LibraryUpdateContext);
}

export const LibraryUpdateProvider = LibraryUpdateContext.Provider;
export const LibraryUpdateConsumer = LibraryUpdateContext.Consumer;
