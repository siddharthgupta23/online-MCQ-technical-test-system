import axios from 'axios';

const API = axios.create({
  baseURL: 'https://online-mcq-technical-test-system.vercel.app/api',
});

// attach token to headers automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const verifyProfile = () => API.get('/profile'); // protected endpoint
export const facultySignup = (data) => API.post('/faculty/signup', data);
export const facultyLogin = (data) => API.post('/faculty/login', data);
export const studentLogin = (data) => API.post('/student/login', data);

export default API;
