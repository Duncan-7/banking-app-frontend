import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://pacific-brook-60350.herokuapp.com/'
});

//local server url
// baseURL: 'http://localhost:3000/',
// heroku url: 'https://pacific-brook-60350.herokuapp.com/'

export default instance;