import { Link } from "react-router-dom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";
import "./Header.css";
import homeIcon from "../../assets/home.svg";

function Header({
  handleLoginClick,
  handleRegistrationClick,
  isMobileMenuOpen,
  toggleMobileMenu,
  isLoggedIn,
  handleLogout,
}) {
  const user = useContext(CurrentUserContext);
  return (
    <header className="header">
      <h1 className="header__title">The Wright Collection of Card Games</h1>
      <div className="header__container">
        <Link className="header__link" to="/">
          <img src={homeIcon} alt="Home Icon" className="header__home" />
        </Link>
        {isLoggedIn ? (
          <div className="header__profile">
            <button
              onClick={handleLogout}
              type="button"
              className="header__button"
            >
              Logout
            </button>
            <Link className="header__link" to="/profile">
              <div className="header__profile-info">
                <p className="header__username">{user.name}</p>
                <img
                  src={user.avatar}
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
