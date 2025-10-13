// import React, { useState, useEffect } from "react";

// export default function Lobby({ currentUser, room, setRoom }) {
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [numPlayers, setNumPlayers] = useState(1); // default singleplayer

//   const handleGameSelect = (game, players = 1) => {
//     setSelectedGame(game);
//     setNumPlayers(players);
//   };

//   if (selectedGame === "war") {
//     return <War room={room} numPlayers={numPlayers} />;
//   }

//   if (selectedGame === "solitaire") {
//     return <Solitaire numPlayers={numPlayers} />;
//   }

//   return (
//     <div className="lobby">
//       <h2>Welcome {currentUser?.name}</h2>
//       <p>Select a game:</p>
//       <button onClick={() => handleGameSelect("war", 2)}>
//         War (Multiplayer)
//       </button>
//       <button onClick={() => handleGameSelect("war", 1)}>
//         War (Singleplayer)
//       </button>
//       <button onClick={() => handleGameSelect("solitaire", 1)}>
//         Solitaire
//       </button>
//     </div>
//   );
// }