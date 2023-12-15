import { create } from 'zustand';
import { DeleteANotification, GetNotifications, UpdateNotificationReadState } from '../firebase/utils';

interface NotificationsStore {
  notifications: [];
  noNotifs: boolean;
  fetchNotifications: () => Promise<void>;
  deleteNotification: (notifID: string) => Promise<void>;
  updateNotificationReadState: (notifID: string) => Promise<void>;
}

const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  noNotifs: false,
  fetchNotifications: async () => {
    try {
      const data = await GetNotifications();
      if (data.length <= 0) {
        set({noNotifs: true})
        return;
      }
      set({ notifications: data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },
  deleteNotification: async (notifID) => {
    try {
      await DeleteANotification(notifID);

      // await set({ notifications: [] }); // Clear the existing notifications (optional)
      await useNotificationsStore.getState().fetchNotifications(); // Fetch updated notifications
    } catch (error) {
      console.error(`Error deleting notification with ID ${notifID}:`, error);
    }
  },
  updateNotificationReadState: async (notifID) => {
    try {
      await UpdateNotificationReadState(notifID);
      await useNotificationsStore.getState().fetchNotifications(); // Fetch updated notifications
    } catch (error) {
      console.error(`Error udpating notification with ID ${notifID}:`, error);
    }
  }

}));

export default useNotificationsStore;
