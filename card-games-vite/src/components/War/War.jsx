import "./War.css";

import { backOfCard } from "../../utils/constants";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { Client, Room } from "colyseus.js";
import JoinRoom from "../JoinRoom/JoinRoom";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

const WS_URL =
  process.env.NODE_ENV === "production"
    ? "wss://ws.mwcardgames.csproject.org"
    : "ws://localhost:2567";

const client = new Client(WS_URL);

function War({
  handleGameIncrement,
  incrementGameWon,
  serverGameStart,
  getCurrentGame,
  isDiscardPileEmpty,
  handleDiscardPileClick,
  animateCardDeal,
  setDiscardPile,
  closeGameSite,
  gameWon,
  setGameWon,
  areCardsDealt,
  setAreCardsDealt,
  room,
  setRoom,
  players,
  setPlayers,
}) {
  const [playerOneDeck, setPlayerOneDeck] = useState([]);
  const [playerTwoDeck, setPlayerTwoDeck] = useState([]);
  const [playerOneDiscard, setPlayerOneDiscard] = useState([]);
  const [playerTwoDiscard, setPlayerTwoDiscard] = useState([]);
  const [gameIsInPlay, setGameIsInPlay] = useState(false);
  const [roundIsInPlay, setRoundIsInPlay] = useState(false);
  const [playerOnePlayedCard, setPlayerOnePlayedCard] = useState({});
  const [playerTwoPlayedCard, setPlayerTwoPlayedCard] = useState({});
  const [cardsAreBeingDrawn, setCardsAreBeingDrawn] = useState(false);
  const [contestedCards, setContestedCards] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [myId, setMyId] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [contestedAnimateFor, setContestedAnimateFor] = useState(null);
  const [winner, setWinner] = useState("");
  const [numberOfPlayersDecided, setNumberOfPlayersDecided] = useState(false);
  const [opponentCardDrawn, setOpponentCardDrawn] = useState(false);

  const contestedCardsRef = useRef([]);
  const contestedOneRef = useRef(null);
  const contestedTwoRef = useRef(null);
  const discardOneRef = useRef(null);
  const discardTwoRef = useRef(null);
  const roomRef = useRef(null);
  const myIdRef = useRef("");
  const opponentIdRef = useRef("");
  const joiningRef = useRef(false);
  const currentUser = useContext(CurrentUserContext);

  function startWarGame() {
    setAreCardsDealt(true);
    setGameWon(false);
    serverGameStart(1, room);
  }

  function incrementGame() {
    if (isLoggedIn) {
      const currentGame = getGame();
      if (typeof currentGame === "string") {
        handleGameIncrement(currentGame);
      }
    }
  }

  function incrementGameWin() {
    if (isLoggedIn) {
      const currentGame = getGame();
      if (typeof currentGame === "string") {
        incrementGameWon(currentGame);
      }
    }
  }

  function toggleGameStart() {
    // if (areCardsDealt) {
    //   setAreCardsDealt(false);
    // } else {
    dealCards();
    setAreCardsDealt(true);
    // }
  }

  function dealCards() {
    setCardsAreBeingDrawn(false);
    room.send("deal_cards", {
      deck_id: localStorage.getItem("deck_id"),
    });
  }

  async function animateDeal() {
    setAnimationInProgress(true);
    const playerOnePileRect = document
      .querySelector(".war__player-pile_one")
      .getBoundingClientRect();
    const playerTwoPileRect = document
      .querySelector(".war__player-pile_two")
      .getBoundingClientRect();
    const cardStackRect = document
      .querySelector(".game__animation-card")
      .getBoundingClientRect();

    const dxOne = playerOnePileRect.left - cardStackRect.left;
    const dyOne = cardStackRect.top - playerOnePileRect.top;

    const dxTwo = playerTwoPileRect.left - cardStackRect.left;
    const dyTwo = cardStackRect.top - playerTwoPileRect.top;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let i = 0; i < 52; i++) {
      await wait(100);

      if (i % 2 === 0) {
        animateCardDeal(dxOne, dyOne, 100);
      } else {
        animateCardDeal(dxTwo, dyTwo, 100);
      }
    }
    await wait(100);
    setGameIsInPlay(true);
    setAnimationInProgress(false);
  }

  function beginRound() {
    setRoundIsInPlay(true);
  }

  function endRound() {
    setRoundIsInPlay(false);
    setOpponentCardDrawn(false);
  }

  function drawCard(id) {
    if (id === "bot") {
      drawBotCard();
      return;
    }
    if (!room || id !== myId) {
      return;
    }
    if (roundIsInPlay || animationInProgress) {
      return;
    }
    room.send("draw_card", { sessionId: id });
    beginRound();
  }

  function drawBotCard() {
    room.send("draw_card", { sessionId: "bot" });
  }

  function playCard(card, player) {
    if (player === "Player 1") {
      setPlayerOnePlayedCard(card);
    } else if (player === "Player 2") {
      setPlayerTwoPlayedCard(card);
    }
  }

  function addToPlayerOneDiscard(deck) {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const discardEl = document.querySelector(".war__discard__player-one");

    if (cardOneEl && cardTwoEl && discardEl) {
      flyCardToDiscard(cardOneEl, cardTwoEl, discardEl, () => {
        setPlayerOneDiscard(deck);
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      });
    }

    if (contestedCardsRef.current.length > 0) {
      setContestedAnimateFor(1);
    }
  }

  function addToPlayerTwoDiscard(deck) {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const discardEl = document.querySelector(".war__discard__player-two");

    if (cardOneEl && cardTwoEl && discardEl) {
      flyCardToDiscard(cardTwoEl, cardOneEl, discardEl, () => {
        setPlayerTwoDiscard(deck);
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      });
    }

    if (contestedCardsRef.current.length > 0) {
      setContestedAnimateFor(2);
    }
  }

  function addToContestedPiles(deck) {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const contestedPileOne = document.querySelector(".war__contested-pile_one");
    const contestedPileTwo = document.querySelector(".war__contested-pile_two");

    flyToContestedPiles(
      cardOneEl,
      cardTwoEl,
      contestedPileOne,
      contestedPileTwo,
      () => {
        setContestedCards(deck);
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      }
    );
  }

  function flyCardToDiscard(cardOneEl, cardTwoEl, discardEl, onFinish) {
    const cloneOne = cardOneEl.cloneNode(true);
    cloneOne.style.position = "absolute";
    cloneOne.style.top = cardOneEl.offsetTop + "px";
    cloneOne.style.left = cardOneEl.offsetLeft + "px";
    cloneOne.style.zIndex = 4;
    cardOneEl.parentElement.appendChild(cloneOne);

    const cloneTwo = cardTwoEl.cloneNode(true);
    cloneTwo.style.position = "absolute";
    cloneTwo.style.top = cardTwoEl.offsetTop + "px";
    cloneTwo.style.left = cardTwoEl.offsetLeft + "px";
    cloneTwo.style.zIndex = 3;
    cardTwoEl.parentElement.appendChild(cloneTwo);

    const cardOneRect = cardOneEl.getBoundingClientRect();
    const cardTwoRect = cardTwoEl.getBoundingClientRect();
    const discardRect = discardEl.getBoundingClientRect();

    const dxOne = discardRect.left - cardOneRect.left;
    const dyOne = discardRect.top - cardOneRect.top;

    const dxTwo = discardRect.left - cardTwoRect.left;
    const dyTwo = discardRect.top - cardTwoRect.top;

    cloneOne
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxOne}px, ${dyOne}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneOne.remove();
        if (onFinish) onFinish();
        endRound();
      });

    cloneTwo
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxTwo}px, ${dyTwo}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneTwo.remove();
      });
  }

  function flyToContestedPiles(
    cardOneEl,
    cardTwoEl,
    contestOne,
    contestTwo,
    onFinish
  ) {
    const isMobile = window.innerWidth <= 550;

    const cloneOne = cardOneEl.cloneNode(true);
    cloneOne.style.position = "absolute";
    cloneOne.style.top = cardOneEl.offsetTop + "px";
    cloneOne.style.left = cardOneEl.offsetLeft + "px";
    cloneOne.style.zIndex = 4;
    cardOneEl.parentElement.appendChild(cloneOne);

    const cloneTwo = cardTwoEl.cloneNode(true);
    cloneTwo.style.position = "absolute";
    cloneTwo.style.top = cardTwoEl.offsetTop + "px";
    cloneTwo.style.left = cardTwoEl.offsetLeft + "px";
    cloneTwo.style.zIndex = 3;
    cardTwoEl.parentElement.appendChild(cloneTwo);

    const cardOneRect = cardOneEl.getBoundingClientRect();
    const cardTwoRect = cardTwoEl.getBoundingClientRect();
    const contestOneRect = contestOne.getBoundingClientRect();
    const contestTwoRect = contestTwo.getBoundingClientRect();

    const dxOne = contestOneRect.left - cardOneRect.left;
    const dyOne = contestOneRect.top - cardOneRect.top;

    const dxTwo = contestTwoRect.left - cardTwoRect.left;
    let dyTwo;
    if (!isMobile) {
      dyTwo = cardTwoRect.top - cardTwoRect.top;
    } else {
      dyTwo = contestTwoRect.top - cardTwoRect.top;
    }

    cloneOne
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxOne}px, ${dyOne}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneOne.remove();
        endRound();
        if (onFinish) onFinish();
      });

    cloneTwo
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxTwo}px, ${dyTwo}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneTwo.remove();
      });
  }

  function checkDiscardOne() {
    setDiscardPile(playerOneDiscard);
    handleDiscardPileClick();
  }

  function checkDiscardTwo() {
    setDiscardPile(playerTwoDiscard);
    handleDiscardPileClick();
  }

  // const handleMultiplayerJoin = (multiRoom) => {
  //   setRoom(multiRoom);
  //   // setIsMultiplayerActive(false);
  // };

  function getGame() {
    return getCurrentGame({
      name: "War",
      description: `War is a two player game where each player flips the top card of their deck and the highest card wins. 
    Game ends when one player has the entire deck`,
    });
  }

  function endGame() {
    if (room) {
      room.send("end_game");
    }
    setGameIsInPlay(false);
    setPlayerOneDeck([]);
    setPlayerTwoDeck([]);
    setPlayerOneDiscard([]);
    setPlayerTwoDiscard([]);
    setContestedCards([]);
    setPlayerOnePlayedCard({});
    setPlayerTwoPlayedCard({});
    setAreCardsDealt(false);
    setRoundIsInPlay(false);
    setGameWon(false);
    closeGameSite();
    setNumberOfPlayersDecided(false);
    setIsConnecting(false);
  }

  function singlePlayerClick() {
    setIsSinglePlayer(true);
    createRoom(true);
    setNumberOfPlayersDecided(true);
    setIsConnecting(false);
  }

  function multiplayerClick() {
    setIsSinglePlayer(false);
    setIsConnecting(true);
    setNumberOfPlayersDecided(true);
  }

  function leaveRoom() {
    setRoom(null);
    endGame();
    setIsConnecting(true);
    if (room) {
      room.send("end_game");
    }
    setNumberOfPlayersDecided(false);
    if (roomRef.current) {
      roomRef.current.removeAllListeners();
      roomRef.current.leave();
      roomRef.current = null;
      joiningRef.current = false;
    }
  }

  async function joinRandomRoom(gameIsSinglePlayer, password) {
    if (joiningRef.current || roomRef.current) {
      console.warn("Trying to join room");
      return;
    }

    console.log("room being created");

    const req = await client.joinOrCreate("war", {
      isSinglePlayer: gameIsSinglePlayer,
      password: password,
      userName: currentUser.name,
    });

    joiningRef.current = true;

    req.then((room) => {
      roomRef.current = room;
      setRoom(room);

      attachListeners(room, {
        setPlayers,
        setIsConnecting,
        setAreCardsDealt,
        setGameWon,
        animateDeal,
        setPlayerOneDeck,
        setPlayerTwoDeck,
        setCardsAreBeingDrawn,
        playCard,
        addToPlayerOneDiscard,
        addToPlayerTwoDiscard,
        addToContestedPiles,
        setPlayerOneDiscard,
        setPlayerTwoDiscard,
        endGame,
        myIdRef,
        opponentIdRef,
      });
      room.send("ready");
    });
  }

  function joinWarRoom(gameIsSinglePlayer, password, roomId) {
    if (joiningRef.current || roomRef.current) {
      console.warn("Trying to join room");
      return;
    }
    console.log("room being created");

    const req = client.joinById(roomId, {
      isSinglePlayer: gameIsSinglePlayer,
      password: password,
    });

    joiningRef.current = true;

    req.then((room) => {
      roomRef.current = room;
      setRoom(room);

      attachListeners(room, {
        setPlayers,
        setIsConnecting,
        setAreCardsDealt,
        setGameWon,
        animateDeal,
        setPlayerOneDeck,
        setPlayerTwoDeck,
        setCardsAreBeingDrawn,
        playCard,
        addToPlayerOneDiscard,
        addToPlayerTwoDiscard,
        addToContestedPiles,
        setPlayerOneDiscard,
        setPlayerTwoDiscard,
        endGame,
        myIdRef,
        opponentIdRef,
      });
      room.send("ready");
    });
  }

  async function createRoom(gameIsSinglePlayer, password) {
    if (joiningRef.current || roomRef.current) {
      console.warn("Trying to join room");
      return;
    }

    console.log("room being created");
    joiningRef.current = true;

    try {
      const room = await client.create("war", {
        isSinglePlayer: gameIsSinglePlayer,
        password: password,
      });

      roomRef.current = room;
      setRoom(room);

      attachListeners(room, {
        setPlayers,
        setIsConnecting,
        setAreCardsDealt,
        setGameWon,
        animateDeal,
        setPlayerOneDeck,
        setPlayerTwoDeck,
        setCardsAreBeingDrawn,
        playCard,
        addToPlayerOneDiscard,
        addToPlayerTwoDiscard,
        addToContestedPiles,
        setPlayerOneDiscard,
        setPlayerTwoDiscard,
        endGame,
        myIdRef,
        opponentIdRef,
      });

      // Send "ready" after the room exists and listeners are attached
      room.send("ready");
    } catch (err) {
      console.error("Failed to create room:", err);
      joiningRef.current = false;
    }
  }

  function attachListeners(
    room,
    {
      setPlayers,
      setIsConnecting,
      setAreCardsDealt,
      setGameWon,
      animateDeal,
      setPlayerOneDeck,
      setPlayerTwoDeck,
      setCardsAreBeingDrawn,
      playCard,
      addToPlayerOneDiscard,
      addToPlayerTwoDiscard,
      addToContestedPiles,
      setPlayerOneDiscard,
      setPlayerTwoDiscard,
      endGame,
      myIdRef,
      opponentIdRef,
    }
  ) {
    room.removeAllListeners();
    room.onStateChange((state) => setPlayers(state.players.toJSON()));

    room.onMessage("players_update", (players) => {
      setPlayers(players);
      console.log(players);
    });

    room.onMessage("game_ready", () => {
      setIsConnecting(false);
    });

    room.onMessage("deck_created", () => {
      setAreCardsDealt(true);
      setGameWon(false);
    });

    room.onMessage("cards_dealt", ({ player1, player2 }) => {
      animateDeal();
      if (player1.sessionId === room.sessionId) {
        setPlayerOneDeck([...player1.cards]);
        setPlayerTwoDeck([...player2.cards]);
      } else {
        setPlayerOneDeck([...player2.cards]);
        setPlayerTwoDeck([...player1.cards]);
      }
    });

    room.onMessage("card_drawn", (returnMessage) => {
      setCardsAreBeingDrawn(true);
      if (returnMessage.card.owner === room.sessionId) {
        setTimeout(() => {
          playCard(returnMessage.card, "Player 1");
        }, 350);
        setPlayerOneDeck(returnMessage.deck);
      } else {
        setOpponentCardDrawn(true);
        setTimeout(() => {
          playCard(returnMessage.card, "Player 2");
        }, 350);
        setPlayerTwoDeck(returnMessage.deck);
      }
    });

    room.onMessage("battle_resolved", (returnMessage) => {
      setTimeout(() => {
        if (
          JSON.stringify(returnMessage.winner) ===
          JSON.stringify(myIdRef.current)
        ) {
          addToPlayerOneDiscard(returnMessage.deck);
        } else if (
          JSON.stringify(returnMessage.winner) ===
          JSON.stringify(opponentIdRef.current)
        ) {
          addToPlayerTwoDiscard(returnMessage.deck);
        }
      }, 1000);
    });

    room.onMessage("battle_contested", (returnMessage) => {
      setTimeout(() => {
        addToContestedPiles(returnMessage.deck);
      }, 1000);
    });

    room.onMessage("cards_reshuffled", (returnMessage) => {
      if (
        JSON.stringify(returnMessage.player) === JSON.stringify(myIdRef.current)
      ) {
        setPlayerOneDeck(returnMessage.drawPile);
        setPlayerOneDiscard(returnMessage.discard);
      } else if (
        JSON.stringify(returnMessage.player) ===
        JSON.stringify(opponentIdRef.current)
      ) {
        setPlayerTwoDeck(returnMessage.drawPile);
        setPlayerTwoDiscard(returnMessage.discard);
      }
    });

    room.onMessage("end_game", () => {
      endGame();
    });

    room.send("ready");

    return () => {
      if (room) {
        room.removeAllListeners();
        room.leave();
      }
    };
  }

  useLayoutEffect(() => {
    // Don’t run if there’s no animation to perform
    if (!contestedAnimateFor) return;

    const el1 = contestedOneRef.current;
    const el2 = contestedTwoRef.current;
    const discardEl =
      contestedAnimateFor === 1 ? discardOneRef.current : discardTwoRef.current;

    // Wait for elements to exist before animating
    if (!el1 || !el2 || !discardEl) {
      const rafId = requestAnimationFrame(() =>
        setContestedAnimateFor(contestedAnimateFor)
      );
      return () => cancelAnimationFrame(rafId);
    }

    // Perform the animation
    flyCardToDiscard(el1, el2, discardEl, () => {
      setContestedCards([]);
      setContestedAnimateFor(null);
    });
  }, [contestedAnimateFor]);

  useEffect(() => {
    contestedCardsRef.current = contestedCards;
  }, [contestedCards]);

  useEffect(() => {
    if (cardsAreBeingDrawn && roundIsInPlay && !animationInProgress) {
      const cardEl = document.querySelector(".war__card__player-one");
      const pileEl = document.querySelector(".war__play-pile__one");
      if (cardEl && pileEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const pileRect = pileEl.getBoundingClientRect();
        const dx = pileRect.left - cardRect.left;
        const dy = pileRect.top - cardRect.top;

        animateCardDeal(dx, dy, 350, ".war__card__player-one");
      }
    }
  }, [playerOneDeck]);

  useEffect(() => {
    if (cardsAreBeingDrawn && opponentCardDrawn && !animationInProgress) {
      const cardEl = document.querySelector(".war__card__player-two");
      const pileEl = document.querySelector(".war__play-pile__two");
      if (cardEl && pileEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const pileRect = pileEl.getBoundingClientRect();
        const dx = pileRect.left - cardRect.left;
        const dy = pileRect.top - cardRect.top;

        animateCardDeal(dx, dy, 350, ".war__card__player-two");
      }
    }
  }, [playerTwoDeck]);

  useEffect(() => {
    if (playerOneDeck.length === 0 && playerOneDiscard.length === 0) {
      setGameIsInPlay(false);
      setGameWon(true);
      const user =
        Object.keys(players)
          .filter((id) => id !== room?.sessionId)
          .map((id) => players[id].userName)[0] || "Player 2";
      setWinner(user);
    }
    if (playerTwoDeck.length === 0 && playerTwoDiscard.length === 0) {
      setGameIsInPlay(false);
      setGameWon(true);
      setWinner(players[room?.sessionId]?.userName);
    }
  }, [playerOneDeck, playerTwoDeck, playerOneDiscard, playerTwoDiscard]);

  useEffect(() => {
    if (isSinglePlayer && roundIsInPlay) {
      drawBotCard();
    }
    if (!roundIsInPlay && gameIsInPlay && playerOneDeck.length === 0) {
      room.send("reshuffle_cards", { sessionId: myId });
    }
    if (!roundIsInPlay && gameIsInPlay && playerTwoDeck.length === 0) {
      room.send("reshuffle_cards", { sessionId: opponentId });
    }
  }, [roundIsInPlay]);

  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.removeAllListeners();
        roomRef.current.leave();
        roomRef.current = null;
        joiningRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    myIdRef.current = myId;
    opponentIdRef.current = opponentId;
  }, [myId, opponentId]);

  useEffect(() => {
    if (!room || !players) return;

    setMyId(room.sessionId);
    const playerIds = Object.keys(players);
    const otherId = playerIds.find((id) => id !== room.sessionId);

    setOpponentId(otherId || null);
  }, [room, players]);

  const { width, height } = useWindowSize();

  return (
    <div className="war">
      {numberOfPlayersDecided && !isConnecting ? (
        <>
          {areCardsDealt && gameWon ? (
            <Confetti width={width - 20} height={height + 150} />
          ) : (
            ""
          )}
          <h2 className="war__title">War</h2>
          {areCardsDealt ? (
            <>
              <button className="war__end-btn" onClick={endGame}>
                End Game
              </button>
              <button onClick={leaveRoom} className="war__leave-room">
                Leave Room
              </button>
            </>
          ) : (
            ""
          )}
          {areCardsDealt && gameWon ? (
            <div className="war__game-won">{winner} has won!</div>
          ) : (
            <div className="war__game-area">
              <div className="war__pile war__player-two-pile">
                <h3 className="war__paragraph">
                  {Object.keys(players)
                    .filter((id) => id !== room?.sessionId)
                    .map((id) => players[id].userName)[0] || "Player 2"}
                </h3>

                {areCardsDealt ? (
                  <div className="war__player-area">
                    <div>
                      <button
                        onClick={() => drawCard(opponentId)}
                        className="war__card-btn war__player-pile war__player-pile_two"
                      >
                        <img
                          key={playerTwoDeck[playerTwoDeck.length - 1]?.code}
                          src={backOfCard}
                          className="war__card war__card__player-two"
                        ></img>
                        <p className="war__paragraph">Draw Pile</p>
                      </button>
                    </div>
                    <div>
                      <div
                        ref={discardTwoRef}
                        className="war__discard__player-two"
                      >
                        <button
                          onClick={checkDiscardTwo}
                          className="war__discard-btn war__card-btn war__player-pile"
                        >
                          {playerTwoDeck.length > 0 ? (
                            <img
                              key={
                                playerTwoDiscard[playerTwoDiscard.length - 1]
                                  ?.code
                              }
                              src={
                                playerTwoDiscard[playerTwoDiscard.length - 1]
                                  ?.image
                              }
                              className="war__card"
                            ></img>
                          ) : (
                            ""
                          )}
                          <p className="war__paragraph">Discard Pile</p>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {areCardsDealt ? (
                <div className="war__pile war__play-area">
                  <div className="war__player-piles-div war__player-piles-div_two">
                    <div className="war__play-pile war__pile_empty war__contested-pile_two">
                      {contestedCards.length > 0 ? (
                        <img
                          ref={contestedTwoRef}
                          key={
                            contestedCards[contestedCards.length - 1]?.code ||
                            "empty-two"
                          }
                          src={contestedCards[contestedCards.length - 1]?.image}
                          className="war__card war__contested-card_two"
                        />
                      ) : null}
                    </div>
                    <div className="war__play-pile war__play-pile__two war__pile_empty">
                      {playerTwoPlayedCard ? (
                        <img
                          src={playerTwoPlayedCard?.image}
                          alt={playerTwoPlayedCard?.code}
                          className="war__card war__played-card war__player-two-card"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {gameIsInPlay ? (
                    ""
                  ) : (
                    <button
                      onClick={toggleGameStart}
                      className="war__reset war__card-btn"
                    >
                      <div className="war__pile__discard">Deal the cards!</div>
                      <div className="war__card war__game-card">
                        {isDiscardPileEmpty ? (
                          <img
                            src={backOfCard}
                            alt="Card Back"
                            className="game__animation-card"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </button>
                  )}

                  <div className="war__player-piles-div">
                    <div className="war__play-pile war__play-pile__one war__pile_empty">
                      {playerOnePlayedCard ? (
                        <img
                          src={playerOnePlayedCard.image}
                          alt={playerOnePlayedCard.code}
                          className="war__card war__played-card war__player-one-card"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="war__play-pile war__pile_empty war__contested-pile_one">
                      {contestedCards.length > 0 ? (
                        <img
                          ref={contestedOneRef}
                          key={
                            contestedCards[contestedCards.length - 2]?.code ||
                            "empty-one"
                          }
                          src={contestedCards[contestedCards.length - 2]?.image}
                          className="war__card war__contested-card_one"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="war__start-game">
                  <div className="war__pile__discard">
                    <button
                      type="button"
                      className={`war__card-btn ${
                        isDiscardPileEmpty
                          ? "war__discard-discard_empty"
                          : "war__pile"
                      }`}
                    >
                      {isDiscardPileEmpty ? (
                        <img
                          src={backOfCard}
                          alt="Card Back"
                          className="war__card"
                        />
                      ) : (
                        ""
                      )}
                    </button>
                  </div>
                  <button
                    onClick={startWarGame}
                    className="solitaire__deal-btn"
                  >
                    Start the war!
                  </button>
                </div>
              )}
              <div className="war__pile war__player-one-pile">
                <h3 className="war__paragraph">
                  {room && players[room.sessionId]
                    ? `${players[room.sessionId].userName}`
                    : "Name"}
                </h3>
                {areCardsDealt ? (
                  <div className="war__player-area">
                    <div>
                      <button
                        onClick={() => drawCard(myId)}
                        className="war__card-btn war__player-pile war__player-pile_one"
                      >
                        <img
                          key={playerOneDeck[playerOneDeck.length - 1]?.code}
                          src={backOfCard}
                          className="war__card war__card__player-one"
                        ></img>
                        <p className="war__paragraph">Draw Pile</p>
                      </button>
                    </div>
                    <div>
                      <div
                        ref={discardOneRef}
                        className="war__discard__player-one"
                      >
                        <button
                          onClick={checkDiscardOne}
                          className="war__discard-btn war__card-btn war__player-pile"
                        >
                          {playerOneDeck.length > 0 ? (
                            <img
                              key={
                                playerOneDiscard[playerOneDiscard.length - 1]
                                  ?.code
                              }
                              src={
                                playerOneDiscard[playerOneDiscard.length - 1]
                                  ?.image
                              }
                              className="war__card"
                            ></img>
                          ) : (
                            ""
                          )}
                          <p className="war__paragraph">Discard Pile</p>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="war__how-many-players">
          {/* {isConnecting ? ( */}
          <JoinRoom
            setRoom={setRoom}
            room={room}
            setNumberOfPlayersDecided={setNumberOfPlayersDecided}
            setIsConnecting={setIsConnecting}
            isConnecting={isConnecting}
            singlePlayerClick={singlePlayerClick}
            multiplayerClick={multiplayerClick}
            joinRandomRoom={joinRandomRoom}
            createRoom={createRoom}
            joinGameRoom={joinWarRoom}
            joiningRef={joiningRef}
          />
        </div>
      )}
    </div>
  );
}

export default War;
