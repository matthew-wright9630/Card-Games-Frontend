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
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import DiscardModal from "../DiscardModal/DiscardModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import About from "../About/About";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
  deleteUser,
  deleteGameInfo,
} from "../../utils/api";
import "./App.css";
import { useEffect, useState } from "react";
import {
  addCardsToPiles,
  createNewDeck,
  drawCard,
  listCardsInPile,
  shuffleAllCards,
} from "../../utils/deckOfCardsApi";

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
  const [selectedItem, setSelectedItem] = useState({});
  const [serverError, setServerError] = useState({});

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

  const handleDeleteClick = (item) => {
    setActiveModal("delete-confirmation-modal");
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setActiveModal("");
    setServerError({});
  };

  const isEditProfileModalOpen = activeModal === "edit-profile-modal";
  const isLoginModalOpen = activeModal === "login-modal";
  const isRegistrationModalOpen = activeModal === "signup-modal";
  const isDiscardModalOpen = activeModal === "discard-modal";
  const isDeleteConfirmationModalOpen =
    activeModal === "delete-confirmation-modal";

  const handleLogin = ({ email, password }, resetForm) => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setUser(data.token);
          handleCloseModal();
          resetForm();
          setServerError({});
        } else if (data.validation) {
          setServerError({
            error: data.validation.body.message,
          });
        } else {
          setServerError({ error: data.message });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleRegistration = ({ email, password, name }, resetForm) => {
    setIsLoading(true);
    register(email, password, name)
      .then((data) => {
        if (data.name) {
          handleLogin({ email, password }, resetForm);
        } else if (data.validation) {
          setServerError({
            error: data.validation.body.message,
          });
        } else {
          setServerError({ error: data.message });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    setCurrentUser({});
  };

  const handleEditProfile = ({ name }, resetForm) => {
    setIsLoading(true);
    editProfileInfo({ name: name }, localStorage.getItem("jwt"))
      .then((data) => {
        if (data.name) {
          setUserData({
            name: data.name,
            email: data.email,
            id: data.id,
          });
          setCurrentUser(data);
          resetForm();
          handleCloseModal();
        } else if (data.validation) {
          setServerError({
            error: data.validation.body.message,
          });
        } else {
          setServerError({ error: data.message });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteUser = (userToDelete) => {
    setIsLoading(true);
    deleteUser({ id: userToDelete }, localStorage.getItem("jwt"))
      .then(() => {
        handleDeleteCards(userToDelete);
        handleLogout();
        handleCloseModal();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteCards = (userId) => {
    gameInfo.map((game) => {
      if (game.owner === userId) {
        handleDeleteGameInfo(game._id);
      }
    });
  };

  const setUser = (token) => {
    setIsLoading(true);
    checkToken(token)
      .then((user) => {
        setCurrentUser(user);
        getGameInfo(user._id);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoggedIn(false);
      })
      .finally(() => setIsLoading(false));
  };

  const handleCardLike = ({ name, description }) => {
    if (!checkGameIsInList(name)) {
      createAndLikeCard(name, description);
    }

    const setGameCardLikes = (updatedGame) => {
      setGameInfo((games) => {
        return games?.map((item) => {
          return item._id === updatedGame._id ? updatedGame : item;
        });
      });
    };

    gameInfo.filter((game) => {
      if (game.name === name) {
        setIsLoading(true);
        if (game.liked) {
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
      }
    });
  };

  const checkGameIsInList = (name) => {
    let gameIsInList = false;
    gameInfo?.filter((game) => {
      if (game.name === name && game.owner === currentUser._id) {
        gameIsInList = true;
      }
    });
    return gameIsInList;
  };

  const createAndLikeCard = (name, description) => {
    setIsLoading(true);
    createNewGameInfo(name, description)
      .then((game) => {
        setGameInfo(getGameInfo(currentUser._id));

        likeGame(game._id, localStorage.getItem("jwt"))
          .then((res) => {
            setGameInfo((games) => {
              if (games === undefined) {
                return [res];
              }
              return games.map((item) => {
                return item._id === res._id ? res : item;
              });
            });
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const createNewGameInfo = (name, description) => {
    return createGameHistory(
      {
        name: name,
        gamesWon: 0,
        gamesPlayed: 0,
        liked: false,
        description: description,
        owner: currentUser._id,
      },
      localStorage.getItem("jwt")
    );
  };

  const getGameInfo = (userId) => {
    setIsLoading(true);
    getGameHistory({ id: userId }, localStorage.getItem("jwt"))
      .then((games) => {
        setGameInfo(games.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteGameInfo = (gameId) => {
    setIsLoading(true);
    deleteGameInfo({ id: gameId }, localStorage.getItem("jwt"))
      .then(() => {
        handleCloseModal();
        getGameInfo(currentUser._id);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
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

  const getCurrentGame = ({ name, description }) => {
    let gameIsInList = false;
    const gameId = gameInfo?.filter((game) => {
      if (game.name === name && game.owner === currentUser._id) {
        gameIsInList = true;
        return game._id;
      }
    });
    if (!gameIsInList) {
      setIsLoading(true);
      return createNewGameInfo(name, description)
        .then((res) => {
          handleGameIncrement(res._id);
          setGameInfo(getGameInfo(currentUser._id));
          return res._id;
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      return gameId[0]._id;
    }
  };

  const handleGameIncrement = (gameId) => {
    setIsLoading(true);
    updateGamesPlayed(gameId, localStorage.getItem("jwt"))
      .then(() => {
        getGameHistory(
          { id: currentUser._id },
          localStorage.getItem("jwt")
        ).then((games) => {
          setGameInfo(games.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const incrementGameWon = (gameId) => {
    setIsLoading(true);
    updateGamesWon(gameId, localStorage.getItem("jwt"))
      .then((res) => {
        getGameHistory(
          { id: currentUser._id },
          localStorage.getItem("jwt")
        ).then((games) => {
          setGameInfo(games.data);
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
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

  const pullCard = (deck, playerName, numberOfCards) => {
    for (let i = 0; i < numberOfCards; i++) {
      setIsLoading(true);
      drawCard(deck, 1)
        .then((data) => {
          if (data.success) {
            const newCard = data.cards.pop();
            setHand([...hand, newCard]);
            addCardToHand(deck, playerName, newCard);
            animateCardDeal();
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

  function animateCardDeal() {
    const elm = document.querySelector(".demo__animation-card");

    const first = elm.getBoundingClientRect();

    elm.style.setProperty("top", 150 + "px");

    const last = elm.getBoundingClientRect();

    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const deltaW = first.width / last.width;
    const deltaH = first.height / last.height;

    elm.animate(
      [
        {
          transformOrigin: "top left",
          transform: `
    translate(${deltaX}px, ${deltaY}px)
    scale(${deltaW}, ${deltaH})
  `,
        },
        {
          transformOrigin: "top left",
          transform: "none",
        },
      ],
      {
        duration: 300,
        easing: "ease-in-out",
        fill: "both",
      }
    );
    setTimeout(() => {
      elm.style.setProperty("top", 0 + "px");
    }, 300);
  }

  const removeSpacesFromName = (name) => {
    return name.replaceAll(" ", "_");
  };

  const addCardToHand = (deck, playerName, card) => {
    const name = removeSpacesFromName(playerName);
    addCardsToPiles(deck, name, card.code)
      .then(() => {
        listCardsInPile(deck, name).then((deck) => {
          deck.piles[name].cards.map((card) => {
            setHand([...hand, card]);
          });
        });
      })
      .catch((err) => console.error(err));
  };

  const handleDiscard = (discardedCard) => {
    setHand((cards) => {
      return cards.filter((card) => {
        if (card.code !== discardedCard.code) {
          return card;
        } else {
          addToDiscard(card);
        }
      });
    });
  };

  const addToDiscard = (card) => {
    addCardsToPiles(localStorage.getItem("deck_id"), "discard", card.code).then(
      () => {
        listCardsInPile(localStorage.getItem("deck_id"), "discard")
          .then((deck) => {
            deck.piles.discard.cards.map((card) => {
              setDiscardPile([...discardPile, card]);
            });
          })
          .catch((err) => console.error(err));
      }
    );
  };

  const openGameSite = (game) => {
    setCurrentGame(game);
  };

  const closeGameSite = () => {
    handleGameEnd();
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
    renderDiscardPile();
  }, [discardPile]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <DndProvider backend={HTML5Backend}>
          <div className="page__content">
            <Header
              handleLoginClick={handleLoginClick}
              handleRegistrationClick={handleRegistrationClick}
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              closeGameSite={closeGameSite}
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
                    setHand={setHand}
                    handleCardLike={handleCardLike}
                    isDrawPileEmpty={isDrawPileEmpty}
                    isDiscardPileEmpty={isDiscardPileEmpty}
                    handleDiscard={handleDiscard}
                    discardPile={discardPile}
                    isLoading={isLoading}
                    handleDiscardPileClick={handleDiscardPileClick}
                    isLoggedIn={isLoggedIn}
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
                      handleDeleteUser={handleDeleteUser}
                      handleDeleteGameInfo={handleDeleteGameInfo}
                      handleDeleteClick={handleDeleteClick}
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
                    isLoggedIn={isLoggedIn}
                    getCurrentGame={getCurrentGame}
                    pullCard={pullCard}
                    hand={hand}
                    setHand={setHand}
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
                path="/war"
                element={
                  <War
                    currentGame={currentGame}
                    handleGameIncrement={handleGameIncrement}
                    incrementGameWon={incrementGameWon}
                    gameActive={gameActive}
                    handleGameStart={handleGameStart}
                    handleGameEnd={handleGameEnd}
                    isLoggedIn={isLoggedIn}
                    getCurrentGame={getCurrentGame}
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
              serverError={serverError}
            />
            <EditModal
              isOpen={isEditProfileModalOpen}
              onCloseModal={handleCloseModal}
              handleEditProfile={handleEditProfile}
              isLoading={isLoading}
              serverError={serverError}
            />
            <RegistrationModal
              isOpen={isRegistrationModalOpen}
              onCloseModal={handleCloseModal}
              handleRegistration={handleRegistration}
              isLoading={isLoading}
              handleLoginClick={handleLoginClick}
              serverError={serverError}
            />
            <DiscardModal
              isOpen={isDiscardModalOpen}
              onCloseModal={handleCloseModal}
              discardPile={discardPile}
            />
            <DeleteConfirmationModal
              activeModal={activeModal}
              isOpen={isDeleteConfirmationModalOpen}
              handleCloseModal={handleCloseModal}
              handleDeleteGameInfo={handleDeleteGameInfo}
              handleDeleteUser={handleDeleteUser}
              selectedItem={selectedItem}
              buttonText={isLoading ? "Deleting..." : "Yes, delete item"}
            />
          </div>
        </DndProvider>
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
