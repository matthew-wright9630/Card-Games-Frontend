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
import About from "../About/About";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { authorize, register, checkToken } from "../../utils/auth";
import { editProfileInfo, likeGame, dislikeGame } from "../../utils/api";
import "./App.css";
import { useEffect, useState } from "react";
import {
  addCardsToPiles,
  createNewDeck,
  createPartialDeck,
  drawCard,
  shuffleAllCards,
  shuffleCardsNotInPlay,
} from "../../utils/deckOfCardsApi";
import Preloader from "../Preloader/Preloader";
import DiscardModal from "../DiscardModal/DiscardModal";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [gameActive, setGameActive] = useState(false);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);
  const [isDrawPileEmpty, setIsDrawPileEmpty] = useState(false);
  const [isDiscardPileEmpty, setIsDiscardPileEmpty] = useState(true);

  const handleEditProfileClick = () => {
    setActiveModal("edit-profile-modal");
  };
  const handleLoginClick = () => {
    setActiveModal("login-modal");
  };
  const handleRegistrationClick = () => {
    setActiveModal("signup-modal");
  };

  const handleDiscardPileClick = () => {
    setActiveModal("discard-modal");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const isEditProfileModalOpen = activeModal === "edit-profile-modal";
  const isLoginModalOpen = activeModal === "login-modal";
  const isRegistrationModalOpen = activeModal === "signup-modal";
  const isDiscardModalOpen = activeModal === "discard-modal";

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
          id: profile.id,
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

  const handleCardLike = (game) => {
    const setGameCardLikes = (updatedGame) => {
      setGameInfo((games) => {
        return games.map((item) =>
          item.id === updatedGame.id ? updatedGame : item
        );
      });
    };

    setIsLoading(true);
    if (game.liked) {
      dislikeGame(game.id, localStorage.getItem("jwt"))
        .then((res) => {
          game.liked = res.liked;
          setGameCardLikes(game);
        })
        .catch(console.error)
        .finally(setIsLoading(false));
    } else {
      likeGame(game.id, localStorage.getItem("jwt"))
        .then((res) => {
          game.liked = res.liked;
          setGameCardLikes(game);
        })
        .catch(console.error)
        .finally(setIsLoading(false));
    }
  };

  const handleGameStart = (numberOfDecks) => {
    setGameActive(true);
    setIsLoading(true);
    if (localStorage.getItem("deck_id") === null) {
      createNewDeck(numberOfDecks)
        .then((data) => {
          localStorage.setItem("deck_id", `${data.deck_id}`);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      shuffle();
    }
  };

  const handleGameEnd = () => {
    setGameActive(false);
    shuffle();
  };

  const shuffle = () => {
    setIsLoading(true);
    shuffleAllCards(localStorage.getItem("deck_id"))
      .then((data) => {
        if (data.success) {
          setHand([]);
          setDiscardPile([]);
          renderDrawPile(data.remaining);
        } else {
          console.log("Sorry, an error has occurred");
        }
      })
      .catch(console.error)
      .finally(setIsLoading(false));
  };

  const renderDrawPile = (remaining) => {
    if (remaining > 0) {
      setIsDrawPileEmpty(false);
    } else {
      setIsDrawPileEmpty(true);
    }
  };

  const renderDiscardPile = () => {
    if (discardPile.length === 0) {
      setIsDiscardPileEmpty(true);
    } else {
      setIsDiscardPileEmpty(false);
    }
  };

  const pullCard = (numberOfCards) => {
    for (let i = 0; i < numberOfCards; i++) {
      setIsLoading(true);
      drawCard(localStorage.getItem("deck_id"), 1)
        .then((data) => {
          if (data.success) {
            addCardToHand(data.cards.pop());
          } else {
            setIsDiscardPileEmpty(true);
            shuffle();
          }
          if (data.remaining === 0) {
            renderDrawPile(data.remaining);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  };

  const addCardToHand = (card) => {
    card.ownwer = localStorage.getItem("jwt");
    setHand([...hand, card]);
  };

  const handleDiscard = (id) => {
    setHand((cards) => {
      return cards.filter((card) => {
        if (card.code !== id) {
          return card;
        } else {
          addToDiscard(card);
        }
      });
    });
  };

  const addToDiscard = (card) => {
    setDiscardPile([card, ...discardPile]);
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
        description: `War is a two player game where each player flips the top card of their deck and the highest card wins. 
        Game ends when one player has the entire deck`,
      },
    ]);
  }, []);

  useEffect(() => {
    renderDiscardPile();
  }, [discardPile]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__content">
          <Header
            handleLoginClick={handleLoginClick}
            handleRegistrationClick={handleRegistrationClick}
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
                  isDrawPileEmpty={isDrawPileEmpty}
                  isDiscardPileEmpty={isDiscardPileEmpty}
                  handleDiscard={handleDiscard}
                  discardPile={discardPile}
                  isLoading={isLoading}
                  handleDiscardPileClick={handleDiscardPileClick}
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
            <Route path="/about-me" element={<About />} />
            <Route path="/solitaire" element={<Solitaire />}></Route>
            <Route path="/war" element={<War />}></Route>
          </Routes>
          <Footer />
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
          <DiscardModal
            isOpen={isDiscardModalOpen}
            onCloseModal={handleCloseModal}
            discardPile={discardPile}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
