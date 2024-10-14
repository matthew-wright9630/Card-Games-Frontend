import { Link } from "react-router-dom";
import "./Header.css";
import avatar from "../../assets/Matthew_Wright_Headshot.jpg";

function Header(user) {
  const clickTest = () => {
    console.log("I am clicked");
  };
  let loggedInTest = true;
  return (
    <header className="header">
      <h1 className="header__title">The Wright Collection of Card Games</h1>
      <div className="header__container">
        <Link className="header__link" to="/">
          <img src="" alt="Wright Games Logo" className="header__logo" />
        </Link>
        {loggedInTest ? (
          <div className="header__profile">
            <button
              onClick={clickTest}
              type="button"
              className="header__button"
            >
              Logout
            </button>
            <Link className="header__link" to="/profile">
              <div className="header__profile-info">
                <p className="header__username">{user.user}</p>
                <img
                  src={avatar}
                  alt="Profile Avatar"
                  className="header__avatar"
                />
              </div>
            </Link>
          </div>
        ) : (
          <div className="header__auth">
            <button
              onClick={clickTest}
              type="button"
              className="header__signup header__button"
            >
              Sign Up
            </button>
            <button
              onClick={clickTest}
              type="button"
              className="header__login header__button"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
