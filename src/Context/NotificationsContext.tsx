import { createContext, useContext, useEffect, useState } from "react";
import { DeleteANotification, GetNotifications, UpdateNotificationReadState } from "../firebase/utils";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

interface NotificationsStore {
  notifications: [];
  noNotifs: boolean;
  fetchNotifications: () => Promise<void>;
  deleteNotification: (notifID: string) => Promise<void>;
  updateNotificationReadState: (notifID: string) => Promise<void>;
}

// @ts-ignore
const NotificationsContext = createContext<NotificationsStore>()

const NotificationsContextProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [noNotifs, setNoNotifs] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  

  

  const fetchNotifications = async () => {
    try {
      const data = await GetNotifications();
      if (data.length <= 0) {
        setNoNotifs(true);
        return;
      }
      setNotifications(data.sort((a,b) => b.timeStamp - a.timeStamp));
      setNoNotifs(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  const deleteNotification = async (notifID) => {
    try {
      setDeleteLoading(true)
      await DeleteANotification(notifID);
    } catch (error) {
      console.log(error)
    }finally {
      setDeleteLoading(false)
    }
  }

  const updateNotificationReadState = async (notifID) => {
    try {
      setUpdateLoading(true);
      // console.log("call for update notification")
      await UpdateNotificationReadState(notifID);
    } catch (error) {
    }finally{
      setUpdateLoading(false);
    }
  }

  // console.log("notification context")

  useEffect(() => {
    fetchNotifications();
  }, [updateLoading,deleteLoading])

  console.log(notifications)
  return (
    // @ts-ignore
    <NotificationsContext.Provider value={{ notifications, noNotifs, updateNotificationReadState, deleteNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}
export default NotificationsContextProvider

export const useNotifications = () => {
  const notifications = useContext(NotificationsContext)
  return notifications;
}