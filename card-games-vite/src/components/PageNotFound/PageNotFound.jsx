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
        Uh oh! There&apos;s nothing here... Sorry.
      </p>
      <button type="button" onClick={() => navigate("/")}>
        Back to Homepage
      </button>
      {/* <Link to="/">Go back</Link> */}
    </div>
  );
}

export default PageNotFound;
