import React, { useState, useEffect } from "react";
import { GiTrophyCup } from "react-icons/gi";
import Loader from "../Loader";
import Modal from "../Modal";
import * as axios from "axios";

const QuizOver = React.forwardRef((props, ref) => {
  const {
    levelsNames,
    score,
    maxQuestions,
    quizLevel,
    percent,
    loadLevelQuestions,
  } = props;

  const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
  const hash = "ba9d47d002bc05374e5a5956d0f4f624";

  const [asked, setAsked] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [characterInfo, setCharacterInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAsked(ref.current);
    // Vérifier la date de localStorage
    if (localStorage.getItem("marvelStorageDate")) {
      const date = localStorage.getItem("marvelStorageDate");
      checkDate(date);
    }
  }, [ref]);

  const checkDate = (date) => {
    const toDay = Date.now();
    const daysDifference = toDay - date;

    const timeDifference = daysDifference / (1000 * 3600 * 24);
    if (timeDifference >= 15) {
      localStorage.clear();
      localStorage.setItem("marvelStorageDate", Date.now());
    }
  };

  const showModal = (id) => {
    setOpenModal(true);

    if (localStorage.getItem(id)) {
      setCharacterInfo(JSON.parse(localStorage.getItem(id)));
      setLoading(false);
    }
    axios
      .get(
        `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`
      )
      .then((response) => {
        //console.log(response);
        setCharacterInfo(response.data);
        setLoading(false);
        localStorage.setItem(id, JSON.stringify(response.data));
        if (!localStorage.getItem("marvelStorageDate")) {
          localStorage.setItem("marvelStorageDate", Date.now());
        }
      })
      .catch((err) => console.log(err));
  };

  const closeModal = () => {
    setOpenModal(false);
    setLoading(true);
  };

  const averageGrade = maxQuestions / 2;

  if (score < averageGrade) {
    setTimeout(() => loadLevelQuestions(quizLevel), 3000);
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const decision =
    score > averageGrade ? (
      <>
        <div className="stepsBtnContainer">
          {quizLevel < levelsNames.length ? (
            <>
              <p className="successMsg">
                <GiTrophyCup size="50px" />
                Bravo, vous passez au niveau suivant
              </p>
              <button
                className="btnResult success"
                onClick={() => loadLevelQuestions(quizLevel)}
              >
                Niveau Suivant
              </button>
            </>
          ) : (
            <>
              <p className="successMsg">Bravo, vous êtes un expert</p>
              <button
                className="btnResult gameOver"
                onClick={() => loadLevelQuestions(0)}
              >
                Accueil
              </button>
            </>
          )}
        </div>
        <div className="percentage">
          <div className="progressPercent">Réussite: {`${percent}`}%</div>
          <div className="progressPercent">
            Note: {score}/{maxQuestions}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="stepsBtnContainer">
          <p className="failureMsg">Vous avez raté</p>
          <button className="btnResult success  ">Niveau Suivant</button>
        </div>
        <div className="percentage">
          <div className="progressPercent">Réussite: {percent}%</div>
          <div className="progressPercent">
            Note: {score}/{maxQuestions}
          </div>
        </div>
      </>
    );

  const resultInModal = !loading ? (
    <>
      <div className="modalHeader">
        <h2>{characterInfo.data.results[0].name}</h2>
      </div>
      <div className="modalBody">
        <div className="comicImage">
          <img
            src={
              characterInfo.data.results[0].thumbnail.path +
              "." +
              characterInfo.data.results[0].thumbnail.extension
            }
            alt={characterInfo.data.results[0].name}
          />
          {characterInfo.attributionText}
        </div>
        <div className="comicDetails">
          <h3>Description</h3>
          {characterInfo.data.results[0].description ? (
            <p>{characterInfo.data.results[0].description}</p>
          ) : (
            <p>Description indisponible ...</p>
          )}
          <h3>Plus d'infos</h3>
          {characterInfo.data.results[0].urls &&
            characterInfo.data.results[0].urls.map((url, index) => (
              <a
                href={url.url}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
              >
                <br />
                {capitalizeFirstLetter(url.type)}
              </a>
            ))}
        </div>
      </div>
      <div className="modalFooter">
        <button className="modalBtn" onClick={closeModal}>
          Fermer
        </button>
      </div>
    </>
  ) : (
    <>
      <div className="modalHeader">
        <h2>Réponse de Marvel</h2>
      </div>
      <div className="modalBody">
        <Loader />
      </div>
    </>
  );

  return (
    <>
      {decision}

      <hr />

      <p>Les réponses auw question posées:</p>
      <div className="answerContainer">
        <table className="answers">
          <thead>
            <tr>
              <th>Question</th>
              <th>Réponses</th>
              <th>infos</th>
            </tr>
          </thead>
          <tbody>
            {score >= averageGrade ? (
              asked.map((question) => (
                <tr key={question.id}>
                  <td>{question.question}</td>
                  <td>{question.answer}</td>
                  <td>
                    <button
                      className="btnInfo"
                      onClick={() => showModal(question.heroId)}
                    >
                      Infos
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">
                  <Loader
                    loadingMsg={"Pas de réponse"}
                    styling={{ textAlign: "center", color: "red" }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal openModal={openModal} closeModal={closeModal}>
        {resultInModal}
      </Modal>
    </>
  );
});

export default React.memo(QuizOver);
