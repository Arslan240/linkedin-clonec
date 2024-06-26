import { Link } from "react-router-dom"
import { LoggedInPage, Portal, ProfileIcon } from "../../components"
import "./NotificationPage.css"
import { BsThreeDots } from "react-icons/bs"
import { useEffect, useState } from "react";
import { DeleteANotification, GetNotifications, getDateFromTimestamp, getUser } from "../../firebase/utils";
import { SpinnerCircularFixed } from "spinners-react";
import { usePopper } from "react-popper";
import NotificationsContextProvider, { useNotifications } from '../../Context/NotificationsContext'
import { NOTIF_TYPE_COMMENT_ADDED_TO_POST, NOTIF_TYPE_COMMENT_REPLIED_TO_COMMENT, NOTIF_TYPE_CONNECT_REQ, NOTIF_TYPE_CONNECT_REQ_ACCEPTED, NOTIF_TYPE_POST_LIKED, auth } from "../../firebase/firebase-config";
import { capitalize } from "../../utils";

const FILTER_ALL = "filter_all";
const FILTER_COMMENTS = "filter_comments";
const FILTER_LIKES = "filter_likes";

const icon_size = 20;
const icon_className = "notif__page__three__dots"

const NotificationPage = () => {
  const [filter, setFilter] = useState(FILTER_ALL);
  const { noNotifs, notifications } = useNotifications();
  const [filteredNotifs, setFilteredNotifs] = useState(notifications);
  // const [noNotifs, setNoNotifs] = useState(false);


  useEffect(() => {
    if (filter === FILTER_ALL) {
      setFilteredNotifs(notifications);
    } else if (filter === FILTER_COMMENTS) {
      setFilteredNotifs(notifications.filter(item => item.type === NOTIF_TYPE_COMMENT_ADDED_TO_POST || item.type === NOTIF_TYPE_COMMENT_REPLIED_TO_COMMENT));
    } else if (filter === FILTER_LIKES) {
      setFilteredNotifs(notifications.filter(item => item.type === NOTIF_TYPE_POST_LIKED));
    }
  }, [filter])

  useEffect(() => {
    setFilteredNotifs(notifications);
  }, [notifications])


  return (
    <LoggedInPage>
      <div className="notif__page__left loggedin__page__left">
        <div className="notif__page__left__settings">
          <div className="notif__page__left__manage__title">Manage your Notifications</div>
          <Link className="manage__title__button">View Settings</Link>
        </div>
      </div>
      <div className="notif__page__results loggedin__page__results">
        <div className="notif__page__result__filters result__section">
          <div
            className={`notif__page__result__filter ${filter === FILTER_ALL && "active"}`}
            onClick={() => setFilter(FILTER_ALL)}
          >All</div>
          <div
            className={`notif__page__result__filter ${filter === FILTER_COMMENTS && "active"}`}
            onClick={() => setFilter(FILTER_COMMENTS)}
          >Comments</div>
          <div
            className={`notif__page__result__filter ${filter === FILTER_LIKES && "active"} `}
            onClick={() => setFilter(FILTER_LIKES)}
          >Likes</div>
        </div>

        <div className="notif__page__actual__notifs__container result__section">

          {filteredNotifs.length > 0
            ? filteredNotifs.map((notif, index) => (
              <Notification key={index} index={index} notification={notif} />
            ))
            : noNotifs
              ? (
                <div className="no_notifs">There are no notifications to show.</div>
              )
              : filter === FILTER_COMMENTS || filter === FILTER_LIKES && filteredNotifs.length === 0  // if the filter is changed and there are not notifications for that filter we show no notifications, otherwise we show loading state.
                ? <div className="no_notifs">There are no notifications to show.</div>
                : <div className="feed__loading__container"><SpinnerCircularFixed color="var(--linkedin-blue)" size={40} /></div>}

        </div>
      </div>

    </LoggedInPage>
  )
}
export default NotificationPage



const Notification = ({ index, notification }) => {
  // loading states
  // const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // popper states
  const [showOptions, setShowOptions] = useState(false);
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  // states derived from notification prop
  const { type, docID, postID, read, timeStamp, } = notification;
  const [isRead, setIsRead] = useState(read);
  const [senderName, setSenderName] = useState("");
  const [deleteLoading,setDeleteLoading] = useState(false)

  const { updateNotificationReadState, deleteNotification} = useNotifications();
  console.log("Delete Loading:", deleteLoading)

  async function fetchUserName(userID) {
    try {
      const user = await getUser(userID);
      return { docID: userID, ...user.data() };
    } catch (error) {
      return null;
    }
  }

  async function callDeleteNotification(docID){
    try {
      setDeleteLoading(true)
      await deleteNotification(docID)
    } catch (error) {
      console.error("Unable to delete")
    }finally{
      setDeleteLoading(false)
      setShowOptions(false)
    }
  }

  useEffect(() => {
    async function updateNotif() {
      try {
        await updateNotificationReadState(docID)
      } catch (error) {
        throw error;
      }
    }

    if (isRead && !read) { //isRead is local state, but read is actual value from database, if read is already true then we don't call the update function.
      updateNotif();
    }
  }, [isRead])

  useEffect(() => {
    async function fetch() {
      let userID;

      if (type === NOTIF_TYPE_CONNECT_REQ) {
        userID = notification.senderID;
      } else if (
        type === NOTIF_TYPE_CONNECT_REQ_ACCEPTED ||
        type === NOTIF_TYPE_POST_LIKED ||
        type === NOTIF_TYPE_COMMENT_ADDED_TO_POST ||
        type === NOTIF_TYPE_COMMENT_REPLIED_TO_COMMENT
      ) {
        userID = notification.userID;
      }

      if (!userID) return;

      const result = await fetchUserName(userID);
      if (!result) return;

      const { firstName, lastName } = result;
      setSenderName(`${firstName} ${lastName}`);
    }

    fetch();
  }, [type, notification]);

  return (
    <>
      <div className={`notif__page__results__notification ${isRead ? "read" : "not_read"}`} onClick={() => setIsRead(true)}>
        <div className="notification__left__section">
          <div className="notification__inner__left__section">
            <div className={`notification__dot ${isRead ? "" : "not_read"}`}></div>
            <ProfileIcon height={50} name={senderName} imageURL="" />
          </div>
          {type === NOTIF_TYPE_CONNECT_REQ &&
            <Link to='/mynetwork/'>
              <NotifDiv senderName={senderName} text={" sent you a connection request"} />
            </Link>
          }
          {type === NOTIF_TYPE_CONNECT_REQ_ACCEPTED &&
            <Link to='/mynetwork/connections'>
              <NotifDiv senderName={senderName} text={" accepted your connection request"} />
            </Link>
          }
          {type === NOTIF_TYPE_POST_LIKED &&
            <Link to={`/in/${auth.currentUser.uid}/activity/post/${postID}`}>
              <NotifDiv senderName={senderName} text={" liked your post. Click to goto your post."} />
            </Link>
          }
          {type === NOTIF_TYPE_COMMENT_ADDED_TO_POST &&
            <Link to={`/in/${auth.currentUser.uid}/activity/post/${postID}`}>
              <NotifDiv senderName={senderName} text={" commented on your post. Click to goto your post."} />
            </Link>
          }
          {type === NOTIF_TYPE_COMMENT_REPLIED_TO_COMMENT &&
            <Link to={`/in/${auth.currentUser.uid}/activity/post/${postID}`}>
              <NotifDiv senderName={senderName} text={" replied to a comment on your post. Click to goto your post."} />
            </Link>
          }
        </div>

        <div className="notif__page__actions__container">
          <div className={`notif__page__notif__actions ${index}`} >
            <span>{getDateFromTimestamp(timeStamp)}</span>
            <div ref={setReferenceElement}>
              {deleteLoading
                ? <SpinnerCircularFixed size={25} color="var(--linkedin-blue)" />
                : <BsThreeDots
                  size={icon_size}
                  className={icon_className}
                  onClick={() => setShowOptions(!showOptions)} />
              }
            </div>
          </div>

        </div>
      </div>

      <Portal idName="">
        <div
          className={`connections__page__remove__options ${showOptions ? "display" : "display__none"}`}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div
            className="notifications__page__delete__notification"
            onClick={() => callDeleteNotification(docID)}
          >
            <span>Delete Notification</span>
          </div>
        </div>
      </Portal>
    </>
  )
}

const NotifDiv = ({ senderName, text }) => {
  return (
    <div className="notif__page__notif__details" onClick={() => console.log("NotifDiv Clicked")}>
      {capitalize(senderName)}<span className="notif__page__notif__bold">{text}</span>
    </div>
  )
}
