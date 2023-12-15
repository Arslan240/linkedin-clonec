import Avatar from "react-avatar"
import "./ProfileIcon.css"
import { SpinnerCircularFixed } from "spinners-react"

type Props = {
  height?: number,
  imageURL?: string,
  name?: string,
}

// name is just provided a letter to remove error of required name
const ProfileIcon = ({height = 25, imageURL = "https://cms-assets.themuse.com/media/lead/6437.jpg", name = "P"} : Props) => {
  // console.log(name)
  return (
    // <div className="profile__icon" style={{height:`${height}px`}}>
    //     <img src={imageURL} alt="" />
    // </div>
    <div className="profile__icon" style={{height:`${height}px`}}>
        {name !== "" && name !== " " ? 
          <Avatar name={name} src={imageURL} round size={height.toString()}/>
          // <Avatar name={name !== "" ? name : "U"} src={imageURL} round size={height.toString()}/>
        : <SpinnerCircularFixed color="var(--linkedin-blue)" size={30}/>}
    </div>
  )
}
export default ProfileIcon