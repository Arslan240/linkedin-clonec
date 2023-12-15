// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Routes, Route, Navigate } from 'react-router-dom'
import {  useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import { Header, RequireAuth, SignupHeader } from './components/index.js'
import { ConnectionsPage, FollowersAndFollowing, FormContext, HomePage, LoadingPage, LoginPage, NetworkPage, NotificationsPage, PostPage, ProfilePage, SearchPage, SignupForm } from './Pages'
// import { checkAuthState, getAuthState, LOADING, SIGNED_UP } from './features/authSlice.js'
import { useAuth, LOADING } from './Context/AuthContext.jsx'
import DontRequireAuth from './components/RequireAuth/DontRequireAuth.js';
import {LOGGED_IN} from './Context/AuthContext.jsx'
// import EducationModal from './components/EducationModal/EducationModal.jsx'

function App() {
  // const { user, status, initialOnboarding, error } = useAuth()
  const { status } = useAuth()
  // const navigate = useNavigate();
  // const authState: AuthState = useSelector(getAuthState)
  // const dispatch = useDispatch()

  // const location = useLocation();


  return (
    <div className='app'>
      {
        status === LOADING ? (
          <LoadingPage />
        ) : (
          <Routes>
            <Route path='/' element={<RequireAuth><Header /></RequireAuth>} >
              <Route index path='/feed' element={<RequireAuth><HomePage/></RequireAuth>} />
              {/* <Route path='/jobs' element={<div>Jobs</div>} /> */}
              <Route path='/search' element={<RequireAuth><SearchPage/></RequireAuth>}></Route>
              <Route path='/mynetwork' element={<RequireAuth><NetworkPage/></RequireAuth>}></Route>
              <Route path='/mynetwork/connections' element={<RequireAuth><ConnectionsPage/></RequireAuth>}></Route>
              <Route path='/mynetwork/follow_manager' element={<RequireAuth><FollowersAndFollowing/></RequireAuth>}></Route>
              <Route path='/notifications' element={<RequireAuth><NotificationsPage/></RequireAuth>}></Route>
              <Route path='/in/:userID/activity/post/:postID' element={<RequireAuth><PostPage/></RequireAuth>}></Route>
              <Route path='/in/:userID' element={<RequireAuth><ProfilePage/></RequireAuth>}></Route>
              <Route path="/" element={<Navigate to="/feed" />} />
            </Route>
            {/* Onboarding signup form */}
            <Route path='/onboarding' element={<FormProvider><SignupHeader /></FormProvider>}>
              <Route path='name' element={<SignupForm/>}/>
            </Route>
            <Route path='/login' element={<DontRequireAuth><LoginPage /></DontRequireAuth>} />
            <Route path='/*' element={<Navigate to="/login" />} />
            {/* <Route path='/*' element={<NotFound/>} */}
          </Routes >
        )
      }

    </div>
  )
}

const FormProvider = ({ children }) => {
  const [SignupFormState, setSignupFormState] = useState({
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    signup__jobTitle: "",
    signup__jobType: "",
    signup__company: "",
    signup__schoolName: "",
    start__year__school: "",
    end__year__school: "",
  })

  const {status, initialOnboarding} = useAuth();
  return status === LOGGED_IN || initialOnboarding === true
  ? <Navigate to='/feed' /> : (
    <FormContext.Provider value={{ SignupFormState, setSignupFormState }}>
      {children}
    </FormContext.Provider>
  )
}

export default App
