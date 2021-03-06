import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuizMarvel } from "../quizMarvel";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import QuizOver from "../QuizOver";
import { FaChevronRight } from "react-icons/fa";

const initialState = {
  quizLevel: 0,
  maxQuestions: 10,
  storedQuestions: [],
  question: null,
  options: [],
  idQuestion: 0,
  btnDisable: true,
  userAnswer: null,
  score: 0,
  showWelcomeMsg: false,
  quizEnd: false,
  percent: null,
};

const levelsNames = ["debutant", "confirme", "expert"];

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
    this.storedDataRef = React.createRef();
  }

  loadQuestions = (quizz) => {
    const fetchArrayQuiz = QuizMarvel[0].quizz[quizz];

    if (fetchArrayQuiz.length >= this.state.maxQuestions) {
      this.storedDataRef.current = fetchArrayQuiz;
      //console.log(this.storedDataRef);
      const newArray = fetchArrayQuiz.map(
        ({ answer, ...keepRest }) => keepRest
      );
      this.setState({ storedQuestions: newArray });
    }
  };

  showToastMsg = (pseudo) => {
    if (!this.state.showWelcomeMsg) {
      this.setState({ showWelcomeMsg: true });
      toast.warn(`Bienvenue ${pseudo}, et bonne chance!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  componentDidMount() {
    this.loadQuestions(levelsNames[this.state.quizLevel]);
  }

  componentDidUpdate(prevProps, prevState) {
    const { maxQuestions, storedQuestions, idQuestion, score, quizEnd } =
      this.state;
    if (
      storedQuestions !== prevState.storedQuestions &&
      storedQuestions.length
    ) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
      });
    }

    if (idQuestion !== prevState.idQuestion && storedQuestions.length) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
        userAnswer: null,
        btnDisable: true,
      });
    }

    //console.log(this.props.userData.pseudo);
    if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
      this.showToastMsg(this.props.userData.pseudo);
    }

    if (quizEnd !== prevState.quizEnd) {
      //console.log(score);
      const gradePercent = this.getPercentage(maxQuestions, score);
      this.gameOver(gradePercent);
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
      //this.gameOver();
      this.setState({ quizEnd: true });
    } else {
      // Next
      this.setState((prevState) => ({ idQuestion: prevState.idQuestion + 1 }));
    }

    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    //console.log(goodAnswer);
    //console.log(this.state.userAnswer);

    if (this.state.userAnswer === goodAnswer) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
      }));

      toast.success(`Bravo +1`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        bodyClassName: "toastify-color",
      });
    } else {
      toast.error(`Vous avez rat?? !!!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        bodyClassName: "toastify-color",
      });
    }
  };

  getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;

  gameOver = (percent) => {
    //console.log(this.state.score);

    if (percent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent,
        //quizEnd: true,
      });
    } else {
      this.setState({
        percent,
        //quizEnd: true,
      });
    }
  };

  loadLevelQuestions = (param) => {
    this.setState({ ...initialState, quizLevel: param });
    this.loadQuestions(levelsNames[param]);
  };

  render() {
    //const { pseudo } = this.props.userData;

    const {
      quizLevel,
      maxQuestions,
      question,
      options,
      idQuestion,
      btnDisable,
      userAnswer,
      score,
      quizEnd,
      percent,
    } = this.state;

    return quizEnd ? (
      <QuizOver
        ref={this.storedDataRef}
        levelsNames={levelsNames}
        score={score}
        maxQuestions={maxQuestions}
        quizLevel={quizLevel}
        percent={percent}
        loadLevelQuestions={this.loadLevelQuestions}
      />
    ) : (
      <>
        {/* <h2>Pseudo: {pseudo}</h2> */}
        <Levels levelsNames={levelsNames} quizLevel={quizLevel} />
        <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions} />
        <h2>{question}</h2>

        {options.map((option, index) => (
          <p
            onClick={() => this.submitAnswer(option)}
            key={index}
            className={`answerOptions ${
              userAnswer === option ? "selected" : null
            }`}
          >
            <FaChevronRight />
            {option}
          </p>
        ))}
        <button
          onClick={() => this.nextQuestion()}
          disabled={btnDisable}
          className="btnSubmit"
        >
          {idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"}
        </button>

        {this.showToastMsg && <ToastContainer />}
      </>
    );
  }
}

export default Quiz;
