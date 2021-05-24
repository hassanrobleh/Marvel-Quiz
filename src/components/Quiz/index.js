import React, { Component } from "react";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";

class Quiz extends Component {
  render() {
    const { pseudo } = this.props.userData;
    return (
      <div>
        <h2>Pseudo: {pseudo}</h2>
        <Levels />
        <ProgressBar />
        <h2>Notre question Quiz</h2>
        <p className="answerOptions">Question 1</p>
        <p className="answerOptions">Question 2</p>
        <p className="answerOptions">Question 3</p>
        <p className="answerOptions">Question 4</p>
        <button className="btnSubmit">Suivant</button>
      </div>
    );
  }
}

export default Quiz;
