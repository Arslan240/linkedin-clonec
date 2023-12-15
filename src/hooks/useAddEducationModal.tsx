import {create} from 'zustand'

interface AddEducationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAddEducationModal = create<AddEducationModalStore>((set) => ({ 
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false})
}))

export default useAddEducationModal