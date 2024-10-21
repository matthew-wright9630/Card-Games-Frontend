import History from "../History/History";
import LikedGames from "../LikedGames/LikedGames";
import "./Profile.css";

function Profile({ gameInfo, handleEditProfileClick, handleCardLike }) {
  /* 
  The Profile component will have 3 functions. It will allow users to edit their profile info (name, avatar), 
  they can see their history (what games have been played, and how many times), and liked games will appear in the list for easy access.
  */
  return (
    <div>
      <div className="profile">
        <section className="profile__history">
          <History gameInfo={gameInfo} />
        </section>
        <section className="profile__liked-games">
          <LikedGames gameInfo={gameInfo} handleCardLike={handleCardLike} />
        </section>
        <button
          type="button"
          onClick={handleEditProfileClick}
          className="profile__edit-btn header__button"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
