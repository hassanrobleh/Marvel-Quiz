import React, { Component } from "react";
import { QuizMarvel } from "../quizMarvel";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";

class Quiz extends Component {
  state = {
    levelsNames: ["debutant", "confirme", "expert"],
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisable: true,
    userAnswer: null,
    score: 0,
  };

  storedDataRef = React.createRef();

  loadQuestions = (quizz) => {
    const fetchArrayQuiz = QuizMarvel[0].quizz[quizz];

    if (fetchArrayQuiz.length >= this.state.maxQuestions) {
      this.storedDataRef.current = fetchArrayQuiz;
      //console.log(this.storedDataRef);
      const newArray = fetchArrayQuiz.map(
        ({ answer, ...keepRest }) => keepRest
      );
      this.setState({ storedQuestions: newArray });
    } else {
      console.log("Pas assez de question");
    }
  };

  componentDidMount() {
    this.loadQuestions(this.state.levelsNames[this.state.quizLevel]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.storedQuestions !== prevState.storedQuestions) {
      this.setState({
        question: this.state.storedQuestions[this.state.idQuestion].question,
        options: this.state.storedQuestions[this.state.idQuestion].options,
      });
    }

    if (this.state.idQuestion !== prevState.idQuestion) {
      this.setState({
        question: this.state.storedQuestions[this.state.idQuestion].question,
        options: this.state.storedQuestions[this.state.idQuestion].options,
        userAnswer: null,
        btnDisable: true,
      });
    }
  }

  submitAnswer = (selectedAnswer) => {
    this.setState({
      userAnswer: selectedAnswer,
      btnDisable: false,
    });
  };

  nextQuestion = () => {
    if (this.state.idQuestion === this.state.maxQuestions - 1) {
      // End
    } else {
      // Next
      this.setState((prevState) => ({
        idQuestion: prevState.idQuestion + 1,
      }));
    }

    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    //console.log(goodAnswer);
    //console.log(this.state.userAnswer);

    if (this.state.userAnswer === goodAnswer) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
      }));
    }
  };

  render() {
    //const { pseudo } = this.props.userData;
    return (
      <div>
        {/* <h2>Pseudo: {pseudo}</h2> */}
        <Levels />
        <ProgressBar />
        <h2>{this.state.question}</h2>

        {this.state.options.map((option, index) => (
          <p
            onClick={() => this.submitAnswer(option)}
            key={index}
            className={`answerOptions ${
              this.state.userAnswer === option ? "selected" : null
            }`}
          >
            {option}
          </p>
        ))}
        <button
          onClick={() => this.nextQuestion()}
          disabled={this.state.btnDisable}
          className="btnSubmit"
        >
          Suivant
        </button>
      </div>
    );
  }
}

export default Quiz;
