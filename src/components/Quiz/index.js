import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuizMarvel } from "../quizMarvel";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import QuizOver from "../QuizOver";

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
    showWelcomeMsg: false,
    quizEnd: false,
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

  showWelcomeMsg = (pseudo) => {
    if (!this.state.showWelcomeMsg) {
      this.setState({
        showWelcomeMsg: true,
      });
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

  notify = () => toast("Wow so easy!");

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

    //console.log(this.props.userData.pseudo);

    if (this.props.userData.pseudo) {
      this.showWelcomeMsg(this.props.userData.pseudo);
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
      this.gameOver();
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
      toast.error(`Vous avez raté !!!`, {
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

  gameOver = () => {
    this.setState({
      quizEnd: true,
    });
  };

  render() {
    //const { pseudo } = this.props.userData;
    return this.state.quizEnd ? (
      <QuizOver />
    ) : (
      <>
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

        <ToastContainer />
      </>
    );
  }
}

export default Quiz;
