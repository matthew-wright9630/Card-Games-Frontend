import "./Preloader.css";

function Preloader({ text = "" }) {
  return (
    <div className="circle-preloader">
      <div className="circle-preloader__circle"></div>
      {text !== "" ? <p className="circle-preloader__paragraph">{text}</p> : ""}
    </div>
  );
}

export default Preloader;
