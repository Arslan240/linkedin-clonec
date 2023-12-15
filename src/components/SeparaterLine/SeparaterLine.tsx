import "./SeparaterLine.css"

type SeparaterProps = {
  mt?: number,
  mr?: number,
  mb?: number,
  ml?: number,
}
const SeparaterLine = ({mt,mr,mb,ml} : SeparaterProps) => {
  return (
    <div className="separater__line" style={{marginTop: mt,marginRight: mr, marginBottom: mb, marginLeft: ml}}></div>
  )
}
export default SeparaterLine