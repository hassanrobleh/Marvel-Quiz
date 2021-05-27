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
  }, [ref]);

  const showModal = (id) => {
    setOpenModal(true);
    axios
      .get(
        `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`
      )
      .then((response) => {
        setCharacterInfo(response.data);
        setLoading(false)
      })
      .catch((err) => console.log(err));
  };

  const closeModal = () => {
    setOpenModal(false);
    setLoading(true)

  };

  const averageGrade = maxQuestions / 2;

  if (score < averageGrade) {
    setTimeout(() => loadLevelQuestions(quizLevel), 3000);
  }

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
        <h3>body</h3>
      </div>
      <div className="modalFooter">
        <button className="modalBtn">Fermer</button>
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
