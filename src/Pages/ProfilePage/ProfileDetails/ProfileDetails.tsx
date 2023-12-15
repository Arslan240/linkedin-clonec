// import { AiOutlinePlus } from "react-icons/ai"
import "./ProfileDetails.css"
import { useEffect, useState } from 'react'
// import { FiEdit2 } from "react-icons/fi";
import { ActivityMedia, SeparaterLine } from "../../../components";
import { GetEducation, GetExperience } from "../../../firebase/utils";
import { EDUCATION_TITLE, EXPERIENCE_TITLE } from '../ProfilePage.jsx'
import { SpinnerCircularFixed } from "spinners-react";


const icon_size = 20;
type ProfielDetailsProps = {
  title: string,
  mediaType?: string,
  mediaURL?: string,
}
const ProfileDetails: React.FC<ProfielDetailsProps> = ({ title }) => {
  const [activities, setActivities] = useState([])
  const [noActivities, setNoActivities] = useState(false);

  useEffect(() => {
    async function fetchActivities() {
      const getActivities = title === EDUCATION_TITLE ? GetEducation : GetExperience;
      try {
        const resultAct = await getActivities();
        if (resultAct === null) {
          setNoActivities(true);
          return;
        }
        setActivities(resultAct);
        setNoActivities(false);
      } catch (error) {
        throw error;
      }
    }
    fetchActivities();
  }, [])


  return (
    <div className="profile__detail__section result__section">
      <div className="profile__page__activity__top__section">
        <span className="profile__page__activity__title">{title}</span>
        <div className="activity__options">
          {/* <div className="profile__page__icon__container">
            <AiOutlinePlus size={icon_size} />
          </div>
          <div className="profile__page__icon__container">
            <FiEdit2 size={icon_size} />
          </div> */}
        </div>
      </div>
      {
        noActivities ? <div>No {title} available</div>
          : activities.length > 0 ?
            activities.map((activity, index) => (
              <div key={index}>
                <div className={`profile__page__actual__activity ${!activity.mediaURL && "no__activity__media"}`} key={activity.docID}>
                  {
                    !activity.mediaURL ? (
                      <span>{title === EXPERIENCE_TITLE ? activity.companyName : activity.school}</span>
                    ) : (
                      <ActivityMedia mediaType="images" mediaURL={activity.mediaURL} type={title} />
                    )
                  }
                  <div>
                    {title === EXPERIENCE_TITLE
                      ? (<p className="activity__title">{activity.title}</p>)
                      : (
                        <p className="activity__title">{activity.degree}</p>
                      )}
                    <span className="profile__page__activity__description">{activity.description}</span>
                  </div>
                </div>
                {index !== activities.length - 1 && <SeparaterLine mb={20} mt={20} />}
              </div>
            ))
            : (<div><SpinnerCircularFixed color="var(--linkedin-blue)" size={icon_size + 10} /></div>)
      }


      {/* <ActivityMedia mediaType={"video"} mediaURL={"https://res.cloudinary.com/dc9a5xscc/video/upload/v1693057986/gp1iz1qpwoudbb1tcfmk.mp4"} /> */}
    </div>
  )
}
export default ProfileDetails