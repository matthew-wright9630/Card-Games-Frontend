import History from "../History/History";
import LikedGames from "../LikedGames/LikedGames";
import "./Profile.css";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";

function Profile({
  gameInfo,
  handleEditProfileClick,
  handleCardLike,
  isLoggedIn,
  openGameSite,
  handleDeleteUser,
  handleDeleteGameInfo,
  handleDeleteClick,
}) {
  const user = useContext(CurrentUserContext);

  function clickDeleteButton() {
    handleDeleteClick(user);
  }

  /* 
  The Profile component will have 3 functions. It will allow users to edit their profile name,
  they can see their history (what games have been played, and how many times), and liked games will appear in the list for easy access.
  */
  return (
    <div>
      <div className="profile">
        <section className="profile__history">
          <History
            gameInfo={gameInfo}
            handleDeleteGameInfo={handleDeleteGameInfo}
            handleDeleteClick={handleDeleteClick}
          />
        </section>
        <section className="profile__liked-games">
          <LikedGames
            gameInfo={gameInfo}
            handleCardLike={handleCardLike}
            isLoggedIn={isLoggedIn}
            openGameSite={openGameSite}
          />
        </section>
        <div className="profile__buttons">
          <button
            type="button"
            onClick={handleEditProfileClick}
            className="profile__edit-btn header__button"
          >
            Edit Profile
          </button>
          {user ? (
            <button
              type="button"
              onClick={clickDeleteButton}
              className="profile__delete-btn header__button"
            >
              Delete User
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
