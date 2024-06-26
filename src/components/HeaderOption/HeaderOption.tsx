import { IconType } from "react-icons/lib/esm/iconBase"
import { NavLink } from "react-router-dom"
import "./HeaderOption.css"

type HeaderOptionProps = {
  icon?: IconType,
  title: string,
  notifications?: boolean,
  to: string,
  notifLength?: number;
}

export default function HeaderOption({ icon: Icon, title, to, notifLength }: HeaderOptionProps) {
  return (
    <NavLink to={to} >
      <div className={`headerOption`}>
        <div className="headerOption__notiContainer">
          {Icon && <Icon className="headerOption__icon" size={25} />}

          {notifLength > 0 && <div className="headerOption__notification">
            <span>{notifLength}</span>
          </div>}

        </div>
        <span className="headerOption__title">{title}</span>
      </div>
    </NavLink>
  )
}