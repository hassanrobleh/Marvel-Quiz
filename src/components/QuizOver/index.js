import React, { useState, useEffect } from "react";
import { GiTrophyCup } from "react-icons/gi";

const QuizOver = React.forwardRef((props, ref) => {
  // console.log(props);
  // console.log(ref);

  const {
    levelsNames,
    score,
    maxQuestions,
    quizLevel,
    percent,
    loadLevelQuestions,
  } = props;
  //console.log(loadLevelQuestions);

  const [asked, setAsked] = useState([]);
  //console.log(asked);

  useEffect(() => {
    setAsked(ref.current);
  }, [ref]);

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
                    <button className="btnInfo">Infos</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">
                  <div className="loader"></div>
                  <p style={{ textAlign: "center", color: "red" }}>
                    Pas de réponses!
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default React.memo(QuizOver);
