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
