import { Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound/PageNotFound";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import Solitaire from "../Solitaire/Solitaire";
import War from "../War/War";
import EditModal from "../EditModal/EditModal";
import LoginModal from "../LoginModal/LoginModal";
import RegistrationModal from "../RegistrationModal/RegistrationModal";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { authorize, register, checkToken } from "../../utils/auth";
import { editProfileInfo } from "../../utils/api";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const user = "Matthew";
  const gameInfo = [
    { name: "Solitaire", gamesPlayed: 3, gamesWon: 1, gamesLost: 2 },
    { name: "War", gamesPlayed: 0, gamesWon: 0, gamesLost: 0 },
  ];

  const [activeModal, setActiveModal] = useState("");
  const [isMobileMenuOpen, setMobilMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  const handleEditProfileClick = () => {
    setActiveModal("edit-profile-modal");
  };
  const handleLoginClick = () => {
    setActiveModal("login-modal");
  };
  const handleRegistrationClick = () => {
    setActiveModal("signup-modal");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const isEditProfileModalOpen = activeModal === "edit-profile-modal";
  const isLoginModalOpen = activeModal === "login-modal";
  const isRegistrationModalOpen = activeModal === "signup-modal";

  const handleLogin = ({ email, password }, resetForm) => {
    if (!email || !password) {
      return;
    }

    authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setIsLoggedIn(true);
          setUser(data.token);
          handleCloseModal();
          resetForm();
        }
      })
      .catch(console.error);
  };

  const handleRegistration = ({ email, password, name, avatar }, resetForm) => {
    register(email, password, name, avatar)
      .then((data) => {
        if (data.name) {
          navigate("/");
          handleLogin({ email, password }, resetForm);
          resetForm();
          handleCloseModal();
        }
      })
      .catch(console.error);
  };

  const editProfile = ({ name, avatar }, resetForm) => {
    editProfileInfo(name, avatar);
  };

  const setUser = (token) => {
    checkToken(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoggedIn(false);
      });
  };

  useEffect(() => {
    if (!activeModal) return;

    const handleEscPress = (evt) => {
      if (evt.key === "Escape") {
        handleCloseModal();
      }
    };

    function handleOverlayClick(evt) {
      if (evt.target.classList.contains("modal_opened")) {
        handleCloseModal();
      }
    }

    document.addEventListener("keydown", handleEscPress);
    document.addEventListener("mousedown", handleOverlayClick);

    return () => {
      document.removeEventListener("keydown", handleEscPress);
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [activeModal]);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen === true) {
      setMobilMenuOpen(false);
    } else {
      setMobilMenuOpen(true);
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__content">
          <Header
            handleLoginClick={handleLoginClick}
            handleRegistrationClick={handleRegistrationClick}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
            isLoggedIn={isLoggedIn}
            user={user}
          />
          <Routes>
            <Route path="*" element={<PageNotFound />}></Route>
            <Route path="/" element={<Main />}></Route>
            <Route
              path="/profile"
              element={
                <Profile
                  gameInfo={gameInfo}
                  handleEditProfileClick={handleEditProfileClick}
                />
              }
            ></Route>
            <Route path="/solitaire" element={<Solitaire />}></Route>
            <Route path="/war" element={<War />}></Route>
          </Routes>
          <Footer></Footer>
          <LoginModal
            isOpen={isLoginModalOpen}
            onCloseModal={handleCloseModal}
            handleLogin={handleLogin}
            isLoading={isLoading}
            handleRegistrationClick={handleRegistrationClick}
          />
          <EditModal
            isOpen={isEditProfileModalOpen}
            onCloseModal={handleCloseModal}
            handle
          />
          <RegistrationModal
            isOpen={isRegistrationModalOpen}
            onCloseModal={handleCloseModal}
            handleRegistration={handleRegistration}
            isLoading={isLoading}
            handleLoginClick={handleLoginClick}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
