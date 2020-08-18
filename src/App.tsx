import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper, Button } from "@material-ui/core";

function App() {
  let [score, setScore] = useState(0);
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
      setChoices([...incorrect_answers, correct_answer]);
      setQuestion(questionAsked);
      // setChoices([
      //   ...jsonQuestions.results.incorrect_answers,
      //   jsonQuestions.results.correct_answer,
      // ]);
      console.log("questions = ", jsonQuestions.results);
      return;
    })();
  }, []);

  function selectedOption(item: String) {
    if (item === totalQuestions[questionNumber - 1].correct_answer) {
      setScore(score + 1);
    }
    setOptionSelected(item);
    setOption(true);
  }

  function onNextButton() {
    let incorrect_answers: String[] =
      totalQuestions[questionNumber].incorrect_answers;
    let correct_answer: String = totalQuestions[questionNumber].correct_answer;
    let questionAsked: String = totalQuestions[questionNumber].question;
    setTotalQuestions(totalQuestions);
    setChoices([...incorrect_answers, correct_answer]);
    setQuestion(questionAsked);
    setQuestionNumber(questionNumber + 1);
    setOption(false);
  }

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
            Score : {score}
          </Typography>
        </Grid>
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
              <Grid container spacing={3} justify="center" alignItems="center">
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
              <Grid container spacing={2} justify="center" alignItems="center">
                {choices.map((item) => {
                  let color = "#00BFFF";
                  if (option) {
                    if (
                      item === totalQuestions[questionNumber - 1].correct_answer
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
          {questionNumber < totalQuestions.length ? (
            <Button
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
              // onClick={() => {
              //   onNextButton();
              // }}
            >
              Finish
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
