import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div>
        <p className="footer__copyright">Developed By: Matthew Wright</p>
        <p className="footer__about">
          Click{" "}
          <Link className="footer__link" to={"/about-me"}>
            here
          </Link>{" "}
          to learn more about me
        </p>
      </div>
      <p className="footer__year">2024</p>
    </div>
  );
}

export default Footer;
