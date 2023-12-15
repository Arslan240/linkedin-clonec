import { doc, setDoc } from "firebase/firestore"
import { ACC_TYPE_JOB_HOLDER, ACC_TYPE_STUDENT, FIELD_SEARCH_TERMS, USERS_COLL_NAME, auth } from "../../firebase-config";
import { db } from "../../firebase-config"
import { getUser } from "../getUser";
import { addAFieldToUser } from "../UserUtils/addAFieldToUser";

export const addSearchTerms = async () => {
  try {
    const user = await getUser()
    const { firstName, lastName, country, city } = user.data()
    let searchTerms;

    // country and city are set to lowercase because country and city are not stored in db with lowercase because they are being fetched and directly passed to react-country-region-selector in their original form. just in search terms we are lower casing them.
    
    if (user.get("accountType") === ACC_TYPE_STUDENT) {
      const { schoolName, startYear, endYear } = user.data();
      searchTerms = [firstName, lastName, country.toLowerCase(), city.toLowerCase(), schoolName, startYear, endYear]
    } else if (user.get("accountType") === ACC_TYPE_JOB_HOLDER) {
      const { company, jobTitle, jobType } = user.data();
      searchTerms = [firstName, lastName, country.toLowerCase(), city.toLowerCase(), company, jobTitle, jobType]
    }

    addAFieldToUser(FIELD_SEARCH_TERMS, searchTerms)
  } catch (error) {
    console.error("Error adding searchTerms: ", error);
  }
};
