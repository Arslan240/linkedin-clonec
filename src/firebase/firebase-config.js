// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore()

// COLLECTION NAMES
export const USERS_COLL_NAME = "users"
export const POSTS_COLL_NAME = "posts"
export const NOTIF_COLL_NAME = "notifications"
export const RECEIVED_REQS_COLL_NAME = "received_requests"
export const SENT_REQS_COLL_NAME = "sent_requests"
export const CONNECTIONS_COLL_NAME = "connections"
export const FOLLOWERS_COLL_NAME = "followers"
export const FOLLOWING_COLL_NAME = "following"
export const COMMENTS_COLL_NAME = "comments"
export const EDUCATION_COLL_NAME = "education"
export const EXPERIENCE_COLL_NAME = "experience"

// media types
export const MEDIA_TYPE_NONE = "none"
export const MEDIA_TYPE_POLL = "poll"
export const MEDIA_TYPE_DOC = "document"
export const MEDIA_TYPE_VIDEO = "video"
export const MEDIA_TYPE_IMAGES = "images"

// ACCOUNT Types
export const ACC_TYPE_STUDENT = "student"
export const ACC_TYPE_JOB_HOLDER = "job holder"

// USER FIELD NAMES
export const FIELD_INIT_ONBOARDING = "initialOnboarding";
export const FIELD_FIRST_NAME = "firstName";
export const FIELD_LAST_NAME = "lastName";
export const FIELD_COUNTRY = "country";
export const FIELD_CITY = "city";
export const FIELD_COMPANY = "company";
export const FIELD_JOB_TITLE = "jobTitle";
export const FIELD_JOB_TYPE = "jobType";
export const FIELD_SCHOOL_NAME = "schoolName";
export const FIELD_START_YEAR = "startYear";
export const FIELD_END_YEAR = "endYear";
export const FIELD_SEARCH_TERMS = "searchTerms";

// NOTIFICATION TYPES
export const NOTIF_TYPE_CONNECT_REQ = "connect_request"
export const NOTIF_TYPE_CONNECT_REQ_ACCEPTED = "connect_request_accepted"
export const NOTIF_TYPE_POST_LIKED = "post_liked"
export const NOTIF_TYPE_COMMENT_ADDED_TO_POST = "comment_added_to_post"
export const NOTIF_TYPE_COMMENT_REPLIED_TO_COMMENT = "comment_replied_to_comment"


// NOTIFICATION FIELD NAME
export const NOTIF_FIELD_NAME_TYPE = "type"
export const NOTIF_FIELD_NAME_SENDERID = "senderID"
export const NOTIF_FIELD_NAME_RECEIVERID = "receiverID"
export const NOTIF_FIELD_NAME_READ = "read"
export const NOTIF_FIELD_NAME_TIMESTAMP = "timeStamp"
export const NOTIF_FIELD_NAME_STATUS = "status"

// SendConnectRequest Types
export const STATUS_ACCEPTED = "accepted"
export const STATUS_REJECTED = "rejected"
export const STATUS_PENDING = "pending"
export const STATUS_IGNORED = "ignored"