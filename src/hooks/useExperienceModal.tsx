import {create} from 'zustand'

interface ExperienceModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useExperienceModal = create<ExperienceModalStore>((set) => ({ 
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false})
}))

export default useExperienceModal