import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";
import "./Header.css";
import cardLogo from "../../assets/card_logo_v2.png";

function Header({
  handleLoginClick,
  handleRegistrationClick,
  isLoggedIn,
  handleLogout,
  closeGameSite,
}) {
  const user = useContext(CurrentUserContext);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-section">
          <Link onClick={closeGameSite} className="header__link" to="/">
            <img src={cardLogo} alt="Home Icon" className="header__home" />
          </Link>
          <h2 className="header__title">Wright Card Games</h2>
        </div>
        <ul className="header__navigation">
          <li className="header__list-item">Home</li>
          <li className="header__list-item">About Me</li>
          <li className="header__list-item">Contact</li>
        </ul>
        {isLoggedIn ? (
          <div className="header__profile">
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
        <button className="header__mobile-menu">Click me!</button>
      </div>
    </header>
  );
}

export default Header;
