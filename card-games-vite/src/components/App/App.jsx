import { Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound/PageNotFound";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import Solitaire from "../Solitaire/Solitaire";
import War from "../War/War";
import "./App.css";

function App() {
  const user = "Matthew";
  return (
    <div className="page">
      <div className="page__content">
        <Header user={user} />
        <Routes>
          <Route path="*" element={<PageNotFound />}></Route>
          <Route path="/" element={<Main />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/solitaire" element={<Solitaire />}></Route>
          <Route path="/war" element={<War />}></Route>
        </Routes>
        <Footer></Footer>
      </div>
    </div>
  );
}
export default App;
