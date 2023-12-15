import { Outlet } from "react-router-dom"
import "./SignupHeader.css"

type Props = {
  height?: number
}
const SignupHeader = ({height = 25} : Props) => {
  return (
    <div className="shared__container">
      <div className="login__header">
          <div className="login__imgContainer">
            <img style={{height: height}} src="https://www.edigitalagency.com.au/wp-content/uploads/Linkedin-logo-png.png" />
          </div>
      </div>
      <Outlet/>
    </div>
  )
}
export default SignupHeader