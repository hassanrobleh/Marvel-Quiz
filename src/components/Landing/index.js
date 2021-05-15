import React, { useRef, useEffect, useState, Fragment } from "react";

const Landing = () => {
  const [btn, setBtn] = useState(false);

  const wolverineRef = useRef();
  console.log(wolverineRef);

  useEffect(() => {
    //   console.log("Je suis dans useEffect");
    wolverineRef.current.classList.add("startingImg");
    setTimeout(() => {
      wolverineRef.current.classList.remove("startingImg");
      setBtn(true);
    }, 1000);
  }, []);

  const setLeftImg = () => {
    wolverineRef.current.classList.add("leftImg");
  };

  const setRightImg = () => {
    wolverineRef.current.classList.add("rightImg");
  };

  const clearImg = () => {
    if (wolverineRef.current.classList.contains("leftImg")) {
      wolverineRef.current.classList.remove("leftImg");
    } else if (wolverineRef.current.classList.contains("rightImg")) {
      wolverineRef.current.classList.remove("rightImg");
    }
  };

  const displayBtn = btn && (
    <Fragment>
      <div onMouseOver={setLeftImg} onMouseOut={clearImg} className="leftBox">
        <button className="btn-welcome">Inscription</button>
      </div>
      <div onMouseOver={setRightImg} onMouseOut={clearImg} className="rightBox">
        <button className="btn-welcome">Connexion</button>
      </div>
    </Fragment>
  );

  return (
    <main ref={wolverineRef} className="welcomePage">   
      {displayBtn}
    </main>
  );
};

export default Landing;
