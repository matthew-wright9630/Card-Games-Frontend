import "./JoinRoom.css";
import { useState } from "react";
import { Client } from "colyseus.js";

const client = new Client("http://localhost:2567");

export default function JoinRoom({
  setRoom,
  room,
  setNumberOfPlayersDecided,
  setIsConnecting,
  isConnecting,
  singlePlayerClick,
  multiplayerClick,
  createOrJoinRoom,
  createRoom,
  joinGameRoom,
  joiningRef,
}) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [roomPassword, setRoomPassword] = useState("");

  const joinRoomById = async () => {
    // if (!roomId) return;
    setIsJoining(true);
    setError("");
    try {
      await joinGameRoom(false, roomPassword, roomId);
      setNumberOfPlayersDecided(true);
    } catch (err) {
      console.error("Join failed:", err);
      const msg = err?.message?.toLowerCase?.() || "";
      if (err?.code === 4212 || msg.includes("not found") || !roomId) {
        setError("Room not found or no longer available.");
      } else if (err.code === 4211) {
        setError("Incorrect password.");
      } else {
        setError("Failed to join room. Please try again.");
      }
    } finally {
      setIsJoining(false);
      joiningRef.current = null;
    }
  };

  const joinRandomRoom = async () => {
    setIsJoining(true);
    setError("");
    try {
      createOrJoinRoom(false);
      setNumberOfPlayersDecided(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join a room. Try again.");
    } finally {
      setIsJoining(false);
      joiningRef.current = null;
    }
  };

  const createNewGame = async () => {
    setIsJoining(true);
    setError("");
    try {
      createRoom(false, roomPassword);
      setNumberOfPlayersDecided(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join room. Please check the ID.");
    } finally {
      setIsJoining(false);
      joiningRef.current = null;
    }
  };

  return (
    <div className="join-room">
      "How many players do you want to play with?"
      <div className="war__buttons">
        <button
          onClick={singlePlayerClick}
          className="war__game-btn war__decision-btn"
        >
          Single Player
        </button>
        <button
          onClick={multiplayerClick}
          className="war__game-btn war__decision-btn"
        >
          Multiplayer
        </button>
      </div>
      {isConnecting ? (
        <>
          <h2 className="join-room__header">Multiplayer Lobby</h2>
          <div className="join-room__room-id">
            <p className="join-room__paragraph">
              Current room id: {room ? room.roomId : ""}
            </p>
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
            onClick={joinRandomRoom}
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
            onClick={() => setIsConnecting(false)}
            disabled={isJoining}
          >
            Back to Single Player
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
