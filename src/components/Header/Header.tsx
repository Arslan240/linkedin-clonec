import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import "./Header.css"
import { HeaderOption, ProfileOption } from "../index"
import { HiHome } from 'react-icons/hi'
import { BsPeopleFill } from 'react-icons/bs'
import { IoMdNotifications } from 'react-icons/io'
import { IoSearchSharp } from 'react-icons/io5'
import { useSearch } from "../../Context/SearchContext"
import { useNotifications } from "../../Context/NotificationsContext"

const Header = () => {
  const {setSearchLoading} = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const {notifications,noNotifs} = useNotifications()


  const handleSearchIconClick = (event) => {
    if (showSearch) {
      // Check if the click occurred within the header__search div or its children
      const isClickInsideSearch = event.target.closest('.header__search');
      if (!isClickInsideSearch) {
        setShowSearch(false);
      }
    }else{
      setShowSearch(true)
    }
  }

  const handleSubmit = async (event) => {
    // @ts-ignore
    setSearchLoading(true);
    event?.preventDefault();
    console.log(searchValue)
    
    if(searchValue){
      navigate(`/search?query=${searchValue}`)
    }
  }
  // console.log("render")

  console.log(notifications)


  useEffect(() => {
    function showSearchEvent(){
      if(document.activeElement !== searchRef.current && showSearch){
        console.log("inside event listener")
        setShowSearch(false);
      }
    }
    document.addEventListener('click', showSearchEvent)

    return( () => document.removeEventListener('click',showSearchEvent))
  },[])

  useEffect(() => {
    if(showSearch){
      searchRef?.current?.focus();
      console.log(searchRef)
    }

    const header__right = document.querySelector('.header__right');
    if(window.innerWidth < 520){
      console.log("first")
      if(showSearch){
        // @ts-ignore
        header__right.style.display = "none";
      }else {
        // @ts-ignore
        header__right.style.display = "block";
      }
    // @ts-ignore
    }else if(header__right.style.display === "none"){

    }
  }, [showSearch])

  // console.log(showSearch)

  return (
    <>
      <div className="headerContainer">
        <div className="header">
          <div className="header__left">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="" className="header__logo" onClick={() => navigate('/')} />

            <div className="header__search" onClick={handleSearchIconClick}>
              <IoSearchSharp className={`header__icon`} size={19} />
              <form onSubmit={(e) => handleSubmit(e)}>
                <input ref={searchRef} 
                  className={`header__search__input ${showSearch ? 'show' : ''}`} 
                  type="text" 
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}  
                />
              </form>
            </div>
          </div>
          <div className="header__right">
            <div className="header__options">
              <HeaderOption icon={HiHome} title="Home" to="/feed" />
              <HeaderOption icon={BsPeopleFill} title="My Network" to="/mynetwork" />
              {/* <HeaderOption icon={BiSolidBriefcase} title="Jobs" to="/jobs" /> */}
              {/* <HeaderOption icon={AiFillMessage} title="Messaging" to="/messages" notifications={true} /> */}
              <HeaderOption icon={IoMdNotifications} title="Notifications" to="/notifications" notifications={notifications.length > 0} notifLength={notifications.length}/>
              {/* TODO: Add the actual username and createa  dynamic route */}
              {/* <Link to={'/me'}> */}
                <ProfileOption />
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <Outlet />
      </div>
    </>

  )
}
export default Header











