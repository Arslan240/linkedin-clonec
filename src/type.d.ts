interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
  }
  
  interface Error {
    message: string;
    code: string;
  }
  
  type AuthState = {
    user: User | null;
    status: string; // You can define a specific type for status if needed
    error: Error | null;
  }
  
// export default AuthState;