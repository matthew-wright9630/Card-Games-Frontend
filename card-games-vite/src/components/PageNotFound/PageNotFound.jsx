import { useNavigate, Link } from "react-router-dom";

import "./PageNotFound.css";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h3 className="not-found__title">
        <span>404</span> - Page Not Found!
      </h3>
      <p className="not-found__text">
        Page does not exist! Please go back to the homepage.
      </p>
    </div>
  );
}

export default PageNotFound;
