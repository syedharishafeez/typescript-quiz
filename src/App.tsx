import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper, Button } from "@material-ui/core";

function App() {
  let [loading, setLoading] = useState(false);
  let [score, setScore] = useState(0);
  let [start, setStart] = useState(true);
  let [option, setOption] = useState(false);
  let [optionSelected, setOptionSelected] = useState<String>();
  let [totalQuestions, setTotalQuestions] = useState<
    {
      incorrect_answers: String[];
      correct_answer: String;
      question: String;
    }[]
  >([]);
  let [questionNumber, setQuestionNumber] = useState(1);
  let [question, setQuestion] = useState<String>();
  let [choices, setChoices] = useState<String[]>([]);
  useEffect(() => {
    setLoading(true);
    setScore(0);
    setOption(false);
    setQuestionNumber(1);
    (async () => {
      let questions = await fetch(
        "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple"
      );
      let jsonQuestions = await questions.json();
      let results: {
        incorrect_answers: String[];
        correct_answer: String;
        question: String;
      }[] = jsonQuestions.results;
      let incorrect_answers: String[] =
        results[questionNumber - 1].incorrect_answers;
      let correct_answer: String = results[questionNumber - 1].correct_answer;
      let questionAsked: String = results[questionNumber - 1].question;
      setTotalQuestions(results);
      let randomOptions: String[] = setRandomOptions(
        incorrect_answers,
        correct_answer
      );
      setChoices([...randomOptions]);
      setQuestion(questionAsked);
      // setChoices([
      //   ...jsonQuestions.results.incorrect_answers,
      //   jsonQuestions.results.correct_answer,
      // ]);
      console.log("questions = ", jsonQuestions.results);
      setLoading(false);
      return;
    })();
  }, [start]);

  function selectedOption(item: String) {
    if (item === totalQuestions[questionNumber - 1].correct_answer) {
      setScore(score + 1);
    }
    setOptionSelected(item);
    setOption(true);
  }

  function setRandomOptions(
    incorrectAnswers: String[],
    correctAnswer: String
  ): String[] {
    let randomNumber = Math.floor((Math.random() * 100) / 25);
    let randomizeArray: String[] = [];
    let j = 0;
    for (let i = 0; i < incorrectAnswers.length + 1; i++) {
      if (randomNumber === i) {
        randomizeArray.push(correctAnswer);
      } else {
        randomizeArray.push(incorrectAnswers[j]);
        j = j + 1;
      }
    }
    console.log(
      `actualArray = ${[
        ...incorrectAnswers,
        correctAnswer,
      ]} randomizeArray = ${randomizeArray}`
    );
    return randomizeArray;
  }

  async function onNextButton() {
    if (option) {
      let incorrect_answers: String[] =
        totalQuestions[questionNumber].incorrect_answers;
      let correct_answer: String =
        totalQuestions[questionNumber].correct_answer;
      let questionAsked: String = totalQuestions[questionNumber].question;
      setTotalQuestions(totalQuestions);
      let randomOptions: String[] = setRandomOptions(
        incorrect_answers,
        correct_answer
      );
      setChoices([...randomOptions]);
      setQuestion(questionAsked);
      setQuestionNumber(questionNumber + 1);
      setOption(false);
    }
  }

  console.log("totalQuestions = ", totalQuestions);
  console.log("questionNumber = ", questionNumber);
  return (
    <Grid container>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h1" style={{ textAlign: "center" }}>
            React Quiz
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            {loading ? `Loading ...` : `Score : ${score}`}
          </Typography>
        </Grid>
        {!loading && (
          <Grid container justify="center" alignItems="center">
            <Grid container justify="center" alignItems="center">
              <Grid item xs={6}>
                <Paper
                  variant="outlined"
                  style={{
                    width: "100%",
                    backgroundColor: "#ecf7fc",
                    padding: "14px 0px 20px 0px",
                  }}
                >
                  <Grid
                    container
                    spacing={3}
                    justify="center"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
                      <Typography variant="h5" style={{ textAlign: "center" }}>
                        Questions {questionNumber}/{totalQuestions.length}
                      </Typography>
                    </Grid>
                    <Grid item xs={11}>
                      <Typography variant="h5" style={{ textAlign: "center" }}>
                        {question}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justify="center"
                    alignItems="center"
                  >
                    {choices.map((item) => {
                      let color = "#00BFFF";
                      if (option) {
                        if (
                          item ===
                          totalQuestions[questionNumber - 1].correct_answer
                        ) {
                          color = "green";
                        }
                        if (
                          optionSelected === item &&
                          totalQuestions[
                            questionNumber - 1
                          ].incorrect_answers.includes(item)
                        ) {
                          color = "red";
                        }
                      }

                      return (
                        <Grid item xs={11}>
                          <Button
                            disabled={option}
                            variant="outlined"
                            style={{
                              width: "100%",
                              backgroundColor: color,
                              textAlign: "center",
                              padding: "5px 0px 5px 0px",
                            }}
                            onClick={() => selectedOption(item)}
                          >
                            {item}
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            <Grid item>
              {questionNumber < totalQuestions.length ||
              (questionNumber === totalQuestions.length && !option) ? (
                <Button
                  disabled={questionNumber === totalQuestions.length}
                  variant="contained"
                  color="primary"
                  style={{ textAlign: "center" }}
                  onClick={() => {
                    onNextButton();
                  }}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ textAlign: "center" }}
                  onClick={() => {
                    setStart(!start);
                  }}
                >
                  Start Again
                </Button>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
