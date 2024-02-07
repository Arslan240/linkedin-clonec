import { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../../Context/AuthContext.jsx'
import "./LoginPage.css"
import { loginSchema } from './loginSchema.js'
import { useFormik } from 'formik'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Navigate, Route, useLocation, useNavigate } from 'react-router-dom'
import { SignupHeader } from '../../components/index.js'
// import { addIntialOnboardingAtSignup } from '../../firebase/utils'
// Inside your component function...



const initialValues = {
  login__email: "",
  login__password: "",
}
const icon_size = 20;


const LoginPage = () => {
  // REDUX stuff
  // const authState: AuthState = useDispatch(getAuthState);
  // const { error: firebaseError } = authState
  // const dispatch = useDispatch()

  // AUTH CONTEXT STATE
  const { user, error: firebaseError, setFirebaseError, logInWithEmailAndPassword, signUpWithEmailAndPassword } = useAuth()

  // REACT ROUTER
  const { state: loc_state } = useLocation();
  // COMPONENT Level State
  const [signIn, setSignIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [demoLogin, setDemoLogin] = useState(false)
  const navigate = useNavigate()

  // Returns if the user is already logged in and redirects to feed route
  if (user) {
    return <Route path='/*' element={<Navigate to="/feed" />} />
  }


  // tracks if error should be shown or not.
  useEffect(() => {
    let errorTimeout;
    const errorShowTime = 3000;
    if (firebaseError?.code === "auth/email-already-in-use" && !showError) {
      setErrorMessage("Email already exists");
      setShowError(true);
      errorTimeout = setTimeout(() => {
        setShowError(false)
        setFirebaseError({})
      }, errorShowTime)
    }
    if (firebaseError?.code === "auth/missing-email" && !showError) {
      setErrorMessage("Account doesn't exits");
      setShowError(true);
      errorTimeout = setTimeout(() => {
        setShowError(false)
        setFirebaseError({})
      }, errorShowTime)
    }
    if (firebaseError?.code === "auth/wrong-password" && !showError) {
      setErrorMessage("Password is wrong");
      setShowError(true);
      errorTimeout = setTimeout(() => {
        setShowError(false)
        setFirebaseError({})
      }, errorShowTime)
    }
    if (firebaseError?.code === "auth/user-not-found" && !showError) {
      setErrorMessage("User Doesn't exist");
      setShowError(true);
      errorTimeout = setTimeout(() => {
        setShowError(false)
        setFirebaseError({})
      }, errorShowTime)
    }
    // if (firebaseError?.code !== "auth/missing-email" || firebaseError?.code !== "auth/email-already-in-use" || firebaseError?.code !== "auth/wrong-password" || firebaseError?.code !== "auth/user-not-found") {
    //   setShowError(false);
    // }

    return () => {
      clearTimeout(errorTimeout)
    }
  }, [firebaseError])

  useEffect(() => {
    if (demoLogin){
      const demoUsername = "islamibhai@gmail.com"
      const demoPassword = "asdf!1A"

      setFieldValue('login__email', demoUsername)
      setFieldValue('login__password', demoPassword)
      setFieldTouched('login__password',true)
      setFieldTouched('login__password',true)
      setDemoLogin(false)
    }
  },[demoLogin])



  const handleLogin = async (values) => {
    // setDummyState(dummyState+1);
    const { login__email: email, login__password: password } = values
    await logInWithEmailAndPassword({ email, password })
    navigate(loc_state?.path === '/' ? '/feed' : loc_state?.path); // if logged out user initially entered a different route, in RequireAuth it was added in state object and we can access that here. If it exists we'll redirect user to that path OR redirect to /feed.
  }

  const handleSignup = async (values) => {
    const { login__email: email, login__password: password } = values
    try {
      await signUpWithEmailAndPassword({ email, password })
      // await addIntialOnboardingAtSignup();
      if (!firebaseError) {
        navigate('/onboarding/name');
      }
    } catch (error) {
    }
  }

  const submitHandler = async (values) => {
    // setDummyState(dummyState1+1);
    if (signIn) {
      await handleLogin(values);
    } else {
      await handleSignup(values);
      // navigate('/onboarding/name');
    }
    // if(user){
    //   actions.resetForm();
    // }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: submitHandler
  })

  const { values, errors, touched, isValid, dirty, handleBlur, handleChange, handleSubmit, isSubmitting,setFieldValue, setFieldTouched } = formik

  if(demoLogin){
    console.log(touched)
    console.log(isValid)
    console.log(values)
    console.log(dirty)
  }

  return (
    <div className="login__page">
      <SignupHeader />
        <div className="login__inputsContainer">
          <h1 className='login__title'>Make the most of your professional life</h1>
          <form className='login__form' onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="login__email">Email</label>
              <input
                value={values.login__email}
                onChange={handleChange}
                onBlur={handleBlur}
                type='email'
                id='login__email'
                className={errors.login__email && touched.login__email ? "input__error" : ''}
              />
              {errors.login__email && touched.login__email &&
                // @ts-ignore
                <p className='login__error'>{errors.login__email}</p>
              }
            </div>
            <div>
              <label htmlFor="login__password">Password</label>
              <div className="login__showPassword">
                <input
                  value={values.login__password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={`${showPassword ? "text" : "password"}`}
                  id="login__password"
                  className={errors.login__password && touched.login__password ? "input__error" : ''}
                />
                {showPassword ?
                  <AiFillEye onClick={() => setShowPassword(!showPassword)} className='login__icon' size={icon_size} />
                  : <AiFillEyeInvisible onClick={() => setShowPassword(!showPassword)} className='login__icon' size={icon_size} />
                }
              </div>

              {errors.login__password && touched.login__password &&
                // @ts-ignore
                <p className='login__error'>{errors.login__password}</p>
              }
            </div>

            <button
              disabled={!dirty}
              type='submit'
              className='login__submit__button'
            >
              {signIn ? "Sign In" : "Sign up"}
            </button>

            {showError && <p className='login__error'>{errorMessage}</p>}


            <span className='login__details'>{signIn ? "New to LinkedIn? " : "Already have an account? "}
              <span className='login__state' onClick={() => !isSubmitting && setSignIn(signIn ? false : true)}>
                {signIn ? "Join Now" : "Sign In"}
              </span>
            </span>
            <button
              className='login__submit__button'
              type='button'
              onClick={() => {
                console.log("Demo login")
                setDemoLogin(true)
              }}
            >
              Demo Login
            </button>
          </form>
        </div>
    </div>
  )
}
export default LoginPage
