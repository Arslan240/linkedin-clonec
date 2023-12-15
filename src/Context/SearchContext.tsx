import { createContext, useContext, useState } from "react";
// import { AddEducation, DeleteANotification, GetEducation, GetNotifications, UpdateNotificationReadState, getFirestoreTimestamp } from "../firebase/utils";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

interface SearchStore {
  searchLoading: boolean;
  setSearchLoading: (boolean) => void;
}
// @ts-ignore
const SearchContext = createContext<SearchStore>()

const SearchContextProvider = ({ children }) => {
  const [searchLoading, setSearchLoading] = useState(false);


  return (
    <SearchContext.Provider value={{ searchLoading, setSearchLoading }}>
      {children}
    </SearchContext.Provider>
  )
}
export default SearchContextProvider

export const useSearch = () => {
  const search = useContext(SearchContext)
  return search;
}