import "./JoinRoom.css";
import { useState } from "react";
import { Client } from "colyseus.js";

const WS_URL =
  process.env.NODE_ENV === "production"
    ? "wss://ws.mwcardgames.csproject.org"
    : "ws://localhost:3001";

const client = new Client(WS_URL);

export default function JoinRoom({
  room,
  setNumberOfPlayersDecided,
  singlePlayerClick,
  multiplayerClick,
  joinRandomRoom,
  createRoom,
  joinGameRoom,
  joiningRef,
  informServerOfGameLeave,
  setIsLoading,
  multiplayerRoomSelected,
  setPreloaderText,
}) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [roomPassword, setRoomPassword] = useState("");

  const joinRoomById = async () => {
    // if (!roomId) return;
    setIsLoading(true);
    setPreloaderText("Joining game...");
    setIsJoining(true);
    setError("");
    if (roomId === "") {
      setError("room ID has not been entered.");
      setIsJoining(false);
      return;
    }
    try {
      await joinGameRoom(false, roomPassword, roomId);
      setNumberOfPlayersDecided(true);
    } catch (err) {
      console.error("Join failed:", err);
      const msg = err?.message?.toLowerCase?.() || "";
      if (err.code === 4210 || err?.code === 4212 || msg.includes("no rooms")) {
        setError("Room not found or no longer available.");
        throw err;
      } else if (err.code === 4211) {
        setError("Incorrect password.");
        throw err;
      } else {
        setError("Failed to join room. Please try again.");
        throw err;
      }
    } finally {
      setIsJoining(false);
      joiningRef.current = null;
      //   setIsLoading(false);
    }
  };

  const findAndJoinRandomRoom = async () => {
    setIsLoading(true);
    setPreloaderText("Searching for a game...");
    setIsJoining(true);
    setError("");
    try {
      await joinRandomRoom(false, roomPassword);
      setNumberOfPlayersDecided(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join a room. Try again.");
      throw err;
    } finally {
      setIsJoining(false);
      joiningRef.current = null;
      //   setIsLoading(false);
    }
  };

  const createNewGame = async () => {
    setIsLoading(true);
    setPreloaderText("Creating a new game...");
    setIsJoining(true);
    setError("");
    try {
      await createRoom(false, roomPassword);
      setNumberOfPlayersDecided(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join room. Please check the ID.");
      throw err;
    } finally {
      setIsJoining(false);
      joiningRef.current = null;
      if (room) {
        setPreloaderText("Searching for other players...");
      }
      //   setIsLoading(false);
    }
  };

  return (
    <div className="join-room">
      How many players do you want to play with?
      {!multiplayerRoomSelected ? (
        <div className="join-room__buttons">
          <button
            onClick={singlePlayerClick}
            className="join-room__btn join-room__decision-btn"
          >
            Single Player
          </button>
          <button
            onClick={multiplayerClick}
            className="join-room__btn join-room__decision-btn"
          >
            Multiplayer
          </button>
        </div>
      ) : (
        <>
          <h2 className="join-room__header">Multiplayer Lobby</h2>
          <div className="join-room__room-id">
            {room ? (
              <p className="join-room__paragraph">
                Current room id: {room ? room.roomId : ""}
              </p>
            ) : (
              ""
            )}
          </div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="join-room__btn"
            onClick={joinRoomById}
            disabled={isJoining}
          >
            Join specific room
          </button>
          <button
            className="join-room__btn"
            onClick={findAndJoinRandomRoom}
            disabled={isJoining}
          >
            Join a random room
          </button>
          <button
            className="join-room__btn"
            onClick={createNewGame}
            disabled={isJoining}
          >
            Create a new room
          </button>
          <input
            type="text"
            placeholder="Password (optional)"
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            className="join-room__btn"
            onClick={() => {
              informServerOfGameLeave();
            }}
          >
            Back to Menu
          </button>
        </>
      )}
    </div>
  );
}
