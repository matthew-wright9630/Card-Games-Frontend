import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext, useState } from "react";
import "./Header.css";
import cardLogo from "../../assets/poker-cards.png";

function Header({
  handleLoginClick,
  handleRegistrationClick,
  isLoggedIn,
  handleLogout,
  closeGameSite,
  handleFeedbackClick,
}) {
  const user = useContext(CurrentUserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-section">
          <Link onClick={closeGameSite} className="header__link" to="/">
            <img src={cardLogo} alt="Home Icon" className="header__home" />
          </Link>
          <h2 className="header__title">Wright Card Games</h2>
        </div>
        <div className="header__navigation">
          <Link className="header__button header__link" to={"/"}>
            Home
          </Link>
          <Link className="header__button header__link" to={"/about-me"}>
            About Me
          </Link>
          <button
            onClick={handleFeedbackClick}
            className="header__feedback header__button"
          >
            Contact Us
          </button>
        </div>
        {isLoggedIn ? (
          <div
            className={`header__profile ${
              isMobileMenuOpen ? "header__profile__mobile_open" : ""
            }`}
          >
            <button
              onClick={() => {
                handleLogout();
                closeGameSite();
              }}
              type="button"
              className="header__button"
            >
              Logout
            </button>
            <Link
              onClick={closeGameSite}
              className="header__link"
              to="/profile"
            >
              <div className="header__profile-info">
                <p className="header__username">{user.name}</p>
              </div>
            </Link>
          </div>
        ) : (
          <div
            className={`header__auth ${
              isMobileMenuOpen ? "header__auth__mobile_open" : ""
            }`}
          >
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
        <button
          onClick={handleMobileMenuClick}
          className="header__mobile-menu"
        ></button>
      </div>
      <button
        onClick={handleMobileMenuClose}
        type="button"
        className={`header__menu-close-button ${
          isMobileMenuOpen === true ? "header__menu-close-button_open" : ""
        }`}
      ></button>
    </header>
  );
}

export default Header;
