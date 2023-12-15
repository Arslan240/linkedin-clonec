import "./NetworkPage.css"
import NetworkPageLeft from "./NetworkPageLeft/NetworkPageLeft"
import NetworkDetailsPage from "./NetworkDetailsPage/NetworkDetailsPage"

const NetworkPage = () => {
  return (
    <div className="networkPage">
        <NetworkPageLeft/>
        <NetworkDetailsPage/>
    </div>
  )
}
export default NetworkPage