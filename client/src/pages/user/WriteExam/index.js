import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import Instructions from "./Instructions";

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [view, setView] = useState("Instructions");
  const [questions = [], setQuestions] = React.useState([]);
  const [result = [], setResult] = React.useState({});
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
        setQuestions(response.data.question || []);
        setSecondsLeft(response.data.duration);
        console.log(response.data); // Added for debugging
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      // Loop through questions to check if selected options are correct
      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      // Determine verdict (Pass/Fail)
      let verdict = "Pass";
      if (wrongAnswers.length >= examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result"); // Assuming setView is used to switch to result view
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const startTimer = () => {
    let totalSeconds = examData.duration; // Assuming duration is in minutes
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000); // Decrease every 1 second
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>

        {view === "Instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-1 p-1">
            <div className="flex justify-between">
              {questions.length > 0 ? (
                <h2 className="txt-2xl">
                  {selectedQuestionIndex + 1}:{" "}
                  {questions[selectedQuestionIndex].name}
                </h2>
              ) : (
                <h2 className="txt-2xl">
                  No questions available for this exam.
                </h2>
              )}

              <div className="timer">
                <span className="text-2xl">{secondsLeft}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h3 className="txt-sm">
                        {option} :{" "}
                        {questions[selectedQuestionIndex].options[option]}
                      </h3>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-between">
              {selectedQuestionIndex > 0 && (
                <button
                  className="primary-outlined-btn"
                  onClick={() => {
                    if (selectedQuestionIndex > 0) {
                      setSelectedQuestionIndex(selectedQuestionIndex - 1);
                    }
                  }}
                >
                  Previous
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Next
                </button>
              )}

              {/* Submit Button */}
              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex  items-center mt-2 justify-center result">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">RESULT</h1>
              <div className="divider"></div>
              <div className="marks">
                <h3 className="text-md">Total Marks : {examData.totalmarks}</h3>
                <h3 className="text-md">
                  Obtained Marks : {result.correctAnswers.length}
                </h3>
                <h3 className="text-md">
                  Wrong Answers : {result.wrongAnswers.length}
                </h3>
                <h3 className="text-md">
                  Passing Marks : {examData.passingMarks}
                </h3>
                <h3 className="text-md">VERDICT : {result.verdict}</h3>

                <div className="flex gap-2 mt-2">
                  <button
                    className="primary-outlined-btn"
                    onClick={() => {
                      setView("Instructions");
                      setSelectedQuestionIndex(0);
                      setSelectedOptions({});
                      setSecondsLeft(examData.duration);
                    }}
                  >
                    Retake Exam
                  </button>
                  <button
                    className="primary-contained-btn"
                    onClick={() => {
                      setView("review");
                    }}
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            </div>
            <div className="lottie-animation">
              {result.verdict === "Pass" && (
                <dotlottie-player
                  src="https://lottie.host/0b9d495f-5c15-470e-b26e-1184ae6a891b/1KsA5sXvRD.lottie"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></dotlottie-player>
              )}

              {result.verdict === "Fail" && (
                <dotlottie-player
                  src="https://lottie.host/2d263b38-593a-45cd-874c-dcee4a9678d3/O1RLnvPuIv.lottie"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></dotlottie-player>
              )}
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`flex flex-col gap-1 p-1 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}
                >
                  <h3 className="txt-xl">
                    {index + 1}: {question.name}
                  </h3>
                  <h4 className="txt-md">
                    Submitted Answer: {selectedOptions[index]}:{" "}
                    {question.options[selectedOptions[index]]}
                  </h4>
                  <h4 className="txt-md">
                    Correct Answer: {question.correctOption} :{" "}
                    {question.options[question.correctOption]}
                  </h4>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="primary-outlined-btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                Close
              </button>
              <button
                className="primary-contained-btn"
                onClick={() => {
                  setView("Instructions");
                  setSelectedQuestionIndex(0);
                  setSelectedOptions({});
                  setSecondsLeft(examData.duration);
                }}
              >
                Retake Exam
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
