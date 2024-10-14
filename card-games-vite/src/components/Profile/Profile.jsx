import "./Profile.css";

function Profile() {
  /* 
  The Profile component will have 3 functions. It will allow users to edit their profile info (name, avatar), 
  they can see their history (what games have been played, and how many times), and liked games will appear in the list for easy access.
  */
  return <div className="profile">
    <button className="profile__edit-btn">Edit Profile</button>
    <section className="profile__history"></section>
    <section className="profile__liked-games"></section>
  </div>;
}

export default Profile;
