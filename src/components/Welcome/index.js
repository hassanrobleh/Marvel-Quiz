import React, { useState, Fragment, useContext, useEffect } from "react";
import { FirebaseContext } from "../Firebase";
import Logout from "../Logout";
import Quiz from "../Quiz";

const Welcome = (props) => {
  const firebase = useContext(FirebaseContext);

  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    let listener = firebase.auth.onAuthStateChanged((user) => {
      user ? setUserSession(user) : props.history.push("/");
    });

    return () => {
      listener();
    };
  }, [firebase, props.history]);

  return userSession === null ? (
    <Fragment>
      <div className="loader"></div>
      <p>Loading ...</p>
    </Fragment>
  ) : (
    <div className="quiz-gb">
      <div className="container">
        <Logout />
        <Quiz />
      </div>
    </div>
  );
};

export default Welcome;
