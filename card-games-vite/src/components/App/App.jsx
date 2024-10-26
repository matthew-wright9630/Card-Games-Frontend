import { Route, Routes } from "react-router-dom";
import { useLocalStorage } from "react-use";
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
import {
  editProfileInfo,
  likeGame,
  dislikeGame,
  createGameHistory,
  getGameHistory,
  updateGamesPlayed,
  updateGamesWon,
} from "../../utils/api";
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
import { games } from "../../utils/constants";

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
  const [currentGame, setCurrentGame] = useState({});

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

    return authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setUser(data.token);
          handleCloseModal();
          resetForm();
          return data.token;
        } else {
          throw new Error("No token received");
        }
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  const handleRegistration = ({ email, password, name, avatar }, resetForm) => {
    register(email, password, name, avatar)
      .then((data) => {
        if (data.name) {
          handleLogin({ email, password }, resetForm)
            .then((token) => {
              createHistory(token);
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    setCurrentUser({});
  };

  const handleEditProfile = ({ name, avatar }, resetForm) => {
    editProfileInfo({ name: name, avatar: avatar }, localStorage.getItem("jwt"))
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
      .catch((err) => console.error(err));
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

  const handleCardLike = ({ game, isLiked }) => {
    const setGameCardLikes = (updatedGame) => {
      setGameInfo((games) => {
        return games.map((item) => {
          return item._id === updatedGame._id ? updatedGame : item;
        });
      });
    };

    setIsLoading(true);
    if (isLiked) {
      dislikeGame(game._id, localStorage.getItem("jwt"))
        .then((res) => {
          setGameCardLikes(res);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      likeGame(game._id, localStorage.getItem("jwt"))
        .then((res) => {
          setGameCardLikes(res);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  };

  const handleGameIncrement = (game) => {
    setIsLoading(true);
    updateGamesPlayed(game._id, localStorage.getItem("jwt"))
      .then((res) => {
        getGameHistory().then((games) => {
          setGameInfo(games.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const incrementGameWon = (game) => {
    setIsLoading(true);
    updateGamesWon(game._id, localStorage.getItem("jwt"))
      .then((res) => {
        getGameHistory().then((games) => {
          setGameInfo(games.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const createHistory = (token) => {
    checkToken(token)
      .then((user) => {
        games.map((game) => {
          createGameHistory(
            {
              name: game.name,
              gamesPlayed: 0,
              gamesWon: 0,
              user: user._id,
              liked: false,
              description: game.description,
            },
            localStorage.getItem("jwt")
          );
        });
        setCurrentUser(user);
      })
      .catch((err) => console.error(err));
  };

  const handleGameStart = (numberOfDecks) => {
    setGameActive(true);
    setIsLoading(true);
    if (localStorage.getItem("deck_id") === null) {
      createNewDeck(numberOfDecks)
        .then((data) => {
          localStorage.setItem("deck_id", `${data.deck_id}`);
        })
        .catch((err) => console.error(err))
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
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
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
        .catch((err) => console.error(err))
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

  const openGameSite = (game) => {
    setCurrentGame(game);
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
    if (currentUser) {
      getGameHistory(localStorage.getItem("jwt")).then((games) => {
        setGameInfo(games.data);
      });
    }
  }, [currentUser]);

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
                  isLoggedIn={isLoggedIn}
                  openGameSite={openGameSite}
                  handleGameIncrement={handleGameIncrement}
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
                    isLoggedIn={isLoggedIn}
                    openGameSite={openGameSite}
                  />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/about-me" element={<About />} />
            <Route
              path="/solitaire"
              element={
                <Solitaire
                  currentGame={currentGame}
                  handleGameIncrement={handleGameIncrement}
                  incrementGameWon={incrementGameWon}
                  gameActive={gameActive}
                  handleGameStart={handleGameStart}
                  handleGameEnd={handleGameEnd}
                />
              }
            ></Route>
            <Route
              path="/war"
              element={
                <War
                  currentGame={currentGame}
                  handleGameIncrement={handleGameIncrement}
                  incrementGameWon={incrementGameWon}
                  gameActive={gameActive}
                  handleGameStart={handleGameStart}
                  handleGameEnd={handleGameEnd}
                />
              }
            ></Route>
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
