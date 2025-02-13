import { Link } from "react-router-dom";
import "./Footer.css";

const copyrightLogo = "\u00A9";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="footer__year">
          {copyrightLogo} 2024. Wright Card Games. All rights reserved
        </p>
      </div>
      <div className="footer__section">
        <p className="footer__copyright">Developed By: Matthew Wright</p>
      </div>
    </footer>
  );
}

export default Footer;
