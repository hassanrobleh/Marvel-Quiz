import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "../Firebase";
import Loader from "../Loader";
import Logout from "../Logout";
import Quiz from "../Quiz";

const Welcome = (props) => {
  const firebase = useContext(FirebaseContext);

  const [userSession, setUserSession] = useState(null);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    let listener = firebase.auth.onAuthStateChanged((user) => {
      user ? setUserSession(user) : props.history.push("/");
    });

    if (!!userSession) {
      //console.log(userSession.uid)
      firebase
        .user(userSession.uid)
        .get()
        .then((doc) => {
          if (doc && doc.exists) {
            const myData = doc.data();
            setUserData(myData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return () => {
      listener();
    };
  }, [firebase, props.history, userSession]);

  return userSession === null ? (
    // <Fragment>
    //   <div className="loader"></div>
    //   <p>Loading ...</p>
    // </Fragment>

    <Loader
      loadingMsg={"Loading ..."}
      styling={{ textAlign: "center", color: "#fff" }}
    />
  ) : (
    <div className="quiz-gb">
      <div className="container">
        <Logout />
        <Quiz userData={userData} />
      </div>
    </div>
  );
};

export default Welcome;
