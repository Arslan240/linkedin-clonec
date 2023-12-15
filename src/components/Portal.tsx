import {createPortal} from 'react-dom'

const Portal:React.FC<{children: React.ReactNode}&{idName?: string}> = ({children}) => {
  // return createPortal(children, document.getElementById(idName))
  return createPortal(children, document.body)
}
export default Portal