import {create} from 'zustand'

interface EditEducationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEditEducationModal = create<EditEducationModalStore>((set) => ({ 
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false})
}))

export default useEditEducationModal