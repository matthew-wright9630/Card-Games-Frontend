import { Link } from "react-router-dom";
import "./About.css";
import avatar from "../../assets/Matthew_Wright_Headshot.jpg";
import LinkedIn from "../../assets/LinkedIn-White.png";
import gitHub from "../../assets/gitHub-Logo.png";

function About() {
  return (
    <div className="about">
      <img src={avatar} alt="Matthew Wright" className="about__image" />
      <div>
        <p className="about__description">
          Hello! My name is Matthew Wright. I am a Full Stack Developer with a
          bachelor's degree in Computer Engineering, and experience with HTML,
          CSS, JavaScript, Node.js, React, Express and MongoDB. Before becoming
          a Full Stack Developer, I worked as a Associate Validation Engineer,
          particularly in computer system validation.
        </p>
        <p className="about__description">
          At TripleTen, I gained experience working on different projects and
          solving difficult programming tasks. To see more of my work, please
          follow me on LinkedIn&reg;{" "}
          <Link
            className="about__link"
            to="https://www.linkedin.com/in/matthew-wright-a76142149/"
          >
            <img
              className="about__link-image"
              src={LinkedIn}
              alt="LinkedIn&reg;"
            />
          </Link>{" "}
          or view my GitHub&reg;{" "}
          <Link
            className="about__link"
            to="https://github.com/matthew-wright9630"
          >
            <img
              className="about__link-image"
              src={gitHub}
              alt="LinkedIn&reg;"
            />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default About;
