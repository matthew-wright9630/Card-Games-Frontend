import { Link } from "react-router-dom";
import "./Footer.css";

function Footer({ handleFeedbackClick }) {
  return (
    <footer className="footer">
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
      <button
        onClick={handleFeedbackClick}
        type="button"
        className="footer__feedback"
      >
        Feedback
      </button>

      <p className="footer__year">2024</p>
    </footer>
  );
}

export default Footer;
