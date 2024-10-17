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
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { authorize, register, checkToken } from "../../utils/auth";
import { editProfileInfo } from "../../utils/api";
import "./App.css";
import { useEffect, useState } from "react";
import { createNewDeck, shuffleAllCards } from "../../utils/deckOfCardsApi";

function App() {
  const gameInfo = [
    {
      name: "Solitaire",
      gamesPlayed: 3,
      gamesWon: 1,
      gamesLost: 2,
      id: "671114d6c9ccabb738b926ed",
    },
    {
      name: "War",
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      id: "671114f4bdeb49a9b52ebc00",
    },
  ];

  const [activeModal, setActiveModal] = useState("");
  const [isMobileMenuOpen, setMobilMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [gameActive, setGameActive] = useState(false);

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
          setUser(data);
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
          handleLogin({ email, password }, resetForm);
          resetForm();
          handleCloseModal();
        }
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    setUserData({});
  };

  const handleEditProfile = ({ name, avatar }, resetForm) => {
    editProfileInfo(name, avatar)
      .then((profile) => {
        setUserData({
          name: profile.name,
          avatar: profile.avatar,
          email: profile.email,
        });
        setCurrentUser(profile);
        resetForm();
        handleCloseModal();
      })
      .catch((err) => console.error);
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

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen === true) {
      setMobilMenuOpen(false);
    } else {
      setMobilMenuOpen(true);
    }
  };

  const handleGameStart = () => {
    setGameActive(true);
  };

  const handleGameEnd = () => {
    setGameActive(false);
  };

  const startDemoGame = () => {
    createNewDeck();
  }

  const endDemoGame = () => {
    shuffleAllCards();
  }

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

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      return;
    }

    setUser(token);
  }, []);

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
            handleLogout={handleLogout}
          />
          <Routes>
            <Route path="*" element={<PageNotFound />}></Route>
            <Route
              path="/"
              element={
                <Main
                gameActive={gameActive}
                  handleGameStart={handleGameStart}
                  handleGameEnd={handleGameEnd}
                />
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile
                    gameInfo={gameInfo}
                    handleEditProfileClick={handleEditProfileClick}
                  />
                </ProtectedRoute>
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
            handleEditProfile={handleEditProfile}
            isLoading={isLoading}
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
