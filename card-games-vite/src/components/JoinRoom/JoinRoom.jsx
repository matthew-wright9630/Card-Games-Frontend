import "./JoinRoom.css";
import { useState } from "react";
import { Client } from "colyseus.js";

const client = new Client("http://localhost:2567");

export default function JoinRoom({ onJoin, setIsMultiplayerActive, room }) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const joinRoomById = async () => {
    if (!roomId) return;
    setIsJoining(true);
    setError("");
    try {
      const room = await client.joinById(roomId, {
        isSinglePlayer: false,
        allowJoin: true,
      });
      onJoin(room);
    } catch (err) {
      console.error(err);
      setError("Failed to join room. Please check the ID.");
    } finally {
      setIsJoining(false);
    }
  };

  const joinRandomRoom = async () => {
    setIsJoining(true);
    setError("");
    try {
      const room = await client.joinOrCreate("war", {
        isSinglePlayer: false,
        allowJoin: true,
      });
      onJoin(room);
    } catch (err) {
      console.error(err);
      setError("Failed to join a room. Try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="join-room">
      <h2 className="join-room__header">Multiplayer Lobby</h2>
      <div className="join-room__room-id">
        <p className="join-room__paragraph">
          Current room id: {room ? room.sessionId : ""}
        </p>
      </div>
      <div>
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
          Join Room
        </button>
      </div>

      <div>
        <button
          className="join-room__btn"
          onClick={joinRandomRoom}
          disabled={isJoining}
        >
          Join Random Room
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        <button
          className="join-room__btn"
          onClick={() => setIsMultiplayerActive(false)}
          disabled={isJoining}
        >
          Back to Single Player
        </button>
      </div>
    </div>
  );
}
