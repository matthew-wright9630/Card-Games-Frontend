import { Link } from "react-router-dom";
import "./Header.css";
import avatar from "../../assets/Matthew_Wright_Headshot.jpg";
import homeIcon from "../../assets/home.svg";

function Header({
  user,
  handleLoginClick,
  handleRegistrationClick,
  isMobileMenuOpen,
  toggleMobileMenu,
  isLoggedIn,
}) {
  const clickTest = () => {
    console.log("I am clicked");
  };
  let loggedInTest = false;
  return (
    <header className="header">
      <h1 className="header__title">The Wright Collection of Card Games</h1>
      <div className="header__container">
        <Link className="header__link" to="/">
          <img src={homeIcon} alt="Home Icon" className="header__home" />
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
              onClick={handleRegistrationClick}
              type="button"
              className="header__signup header__button"
            >
              Sign Up
            </button>
            <button
              onClick={handleLoginClick}
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
