import React, { useContext } from "react";

const BookUpdateContext = React.createContext({});
BookUpdateContext.displayName = 'BookUpdateContextContext';

export default BookUpdateContext;

export function useBookUpdate() {
    return useContext(BookUpdateContext);
}

export const BookUpdateProvider = BookUpdateContext.Provider;
export const BookUpdateConsumer = BookUpdateContext.Consumer;
