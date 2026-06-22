import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getQuizzes = async () => {
  const { data } = await axios.get(`${API_URL}/quizzes`);

  return data;
};

export const getQuizDetail = async (id: number) => {
  const { data } = await axios.get(`${API_URL}/quizzes/${id}`);

  return data;
};

export const submitQuiz = async (quizId: number, answers: any[]) => {
  const token = localStorage.getItem('access_token');

  const res = await axios.post(
    `${API_URL}/quizzes/${quizId}/submit`,
    { answers },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getQuizHistory = async () => {
  const response = await axios.get('http://localhost:8000/api/quiz_attempts');

  return response.data;
};
