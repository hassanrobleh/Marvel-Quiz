import React, { useState, useEffect } from "react";

const QuizOver = React.forwardRef((props, ref) => {
  // console.log(props);
  // console.log(ref);

  const [asked, setAsked] = useState([]);
  console.log(asked);

  useEffect(() => {
    setAsked(ref.current);
  }, [ref]);

  return (
    <>
      <div className="stepsBtnContainer">
        <p className="successMsg">Bravo, vous êtes un expert</p>
        <button className="btnResult success  ">Niveau Suivant</button>
      </div>
      <div className="percentage">
        <div className="progressPercent">Réussite: 10%</div>
        <div className="progressPercent">Note: 2/10</div>
      </div>
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
            {asked.map((question) => (
              <tr key={question.id}>
                <td>{question.question}</td>
                <td>{question.answer}</td>
                <td>
                  <button className="btnInfo">Infos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default React.memo(QuizOver);
