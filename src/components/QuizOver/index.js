import React, { useState, useEffect } from "react";
import { GiTrophyCup } from "react-icons/gi";
import Loader from "../Loader";
import Modal from "../Modal";

const QuizOver = React.forwardRef((props, ref) => {
  const {
    levelsNames,
    score,
    maxQuestions,
    quizLevel,
    percent,
    loadLevelQuestions,
  } = props;

  const [asked, setAsked] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setAsked(ref.current);
  }, [ref]);

  const showModal = (id) => {
    setOpenModal(true);
    console.log(id);
  };

  const closeModal = () => {
    setOpenModal(false);
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
        <div className="modalHeader">
          <h2>Titre </h2>
        </div>
        <div className="modalBody">
          <h3>body</h3>
        </div>
        <div className="modalFooter">
          <button className="modalBtn">Fermer</button>
        </div>
      </Modal>
    </>
  );
});

export default React.memo(QuizOver);
