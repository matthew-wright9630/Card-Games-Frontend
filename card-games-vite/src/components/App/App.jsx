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
import { editProfileInfo, likeGame, dislikeGame } from "../../utils/api";
import "./App.css";
import { useEffect, useState } from "react";
import {
  createNewDeck,
  createPartialDeck,
  drawCard,
  shuffleAllCards,
} from "../../utils/deckOfCardsApi";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [isMobileMenuOpen, setMobilMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [gameActive, setGameActive] = useState(false);
  const [hand, setHand] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);

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

  const handleCardLike = (game) => {
    const setGameCardLikes = (updatedGame) => {
      setGameInfo((games) => {
        return games.map((item) =>
          item.id === updatedGame.id ? updatedGame : item
        );
      });
    };

    if (game.liked) {
      dislikeGame(game.id, localStorage.getItem("jwt"))
        .then((res) => {
          game.liked = res.liked;
          setGameCardLikes(game);
        })
        .catch(console.error);
    } else {
      likeGame(game.id, localStorage.getItem("jwt"))
        .then((res) => {
          game.liked = res.liked;
          setGameCardLikes(game);
        })
        .catch(console.error);
    }
  };

  const handleGameStart = (numberOfDecks) => {
    setGameActive(true);
    if (localStorage.getItem("deck_id") === null) {
      createNewDeck(numberOfDecks).then((data) => {
        //   localStorage.setItem("deck_id", `${data.deck_id}`);
        //   localStorage.setItem("remaining", `${data.remaining}`);
      });
    } else {
      shuffleAllCards(localStorage.getItem("deck_id")).then((data) => {
        if (data.success) {
          console.log(data);
        } else {
          console.log("Sorry, an error has occurred");
        }
      });
    }
  };

  const handleGameEnd = () => {
    setGameActive(false);
    shuffleAllCards(localStorage.getItem("deck_id")).then((data) => {
      setHand([]);
      if (data.success) {
        console.log(data);
      } else {
        console.log("Sorry, an error has occurred");
      }
    });
  };

  const pullCard = (numberOfCards) => {
    
    drawCard(localStorage.getItem("deck_id"), numberOfCards).then((data) => {
      console.log(data);
      addCardToHand(data.cards.pop());
    });
  };

  const addCardToHand = (card) => {
    // card.ownwer = localStorage.getItem("jwt");
    console.log(card);
    setHand([...hand, card]);
  };

  const checkDeckNotEmpty = (deck_id) => {
    if (test) {

    }
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

  useEffect(() => {
    setGameInfo([
      {
        name: "Solitaire",
        gamesPlayed: 3,
        gamesWon: 1,
        gamesLost: 2,
        liked: true,
        id: "671114d6c9ccabb738b926ed",
        description: `Solitaire is a single player game where cards need to be sorted
                          from Ace to King in each suit.`,
      },
      {
        name: "War",
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        liked: false,
        id: "671114f4bdeb49a9b52ebc00",
      },
    ]);
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
                  gameInfo={gameInfo}
                  gameActive={gameActive}
                  handleGameStart={handleGameStart}
                  handleGameEnd={handleGameEnd}
                  pullCard={pullCard}
                  hand={hand}
                  handleCardLike={handleCardLike}
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
                    handleCardLike={handleCardLike}
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
