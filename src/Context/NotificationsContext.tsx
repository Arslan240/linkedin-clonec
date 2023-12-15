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
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  // const [updateLoading, setUpdateLoading] = useState(false);
  

  

  const fetchNotifications = async () => {
    try {
      const data = await GetNotifications();
      if (data.length <= 0) {
        setNoNotifs(true);
        return;
      }
      setNotifications(data);
      setNoNotifs(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  const deleteNotification = async (notifID) => {
    try {
      setIsDeleteLoading(true);
      await DeleteANotification(notifID);
    } catch (error) {
    }finally {
      setIsDeleteLoading(true);
    }
  }

  const updateNotificationReadState = async (notifID) => {
    try {
      // setUpdateLoading(true);
      await UpdateNotificationReadState(notifID);
    } catch (error) {
    }finally{
      // setUpdateLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, [])


  return (
    // @ts-ignore
    <NotificationsContext.Provider value={{ notifications, noNotifs, updateNotificationReadState, deleteNotification, isDeleteLoading, setIsDeleteLoading }}>
      {children}
    </NotificationsContext.Provider>
  )
}
export default NotificationsContextProvider

export const useNotifications = () => {
  const notifications = useContext(NotificationsContext)
  return notifications;
}