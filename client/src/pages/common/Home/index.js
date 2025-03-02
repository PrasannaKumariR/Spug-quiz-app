import React, { useEffect } from "react";
import { message, Row, Col } from "antd";
import { getAllExams } from "../../../apicalls/exams";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    <div>
      {user && <PageTitle title={`Hello ${user.name}, Welcome to SPUG Quiz`} />}
      <div className="divider"></div>
      <Row gutter={[16, 16]}>
        {exams.map((exam) => (
          <Col span={6}>
            <div className="card-lg flex flex-col gap-1 p-2">
              <h1 className="text-2xl">{exam?.name}</h1>
              <h3 className="text-sm">Category: {exam.category}</h3>
              <h3 className="text-sm">Total Marks: {exam.totalmarks}</h3>
              <h3 className="text-sm">Passing Marks: {exam.passingMarks}</h3>
              <h3 className="text-sm">Duration: {exam.duration}</h3>

              <button
                className="primary-outlined-btn "
                onClick={() => navigate(`/user/write-exam/${exam._id}`)}
              >
                Start Exam
              </button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
