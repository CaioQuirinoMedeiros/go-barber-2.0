import axios from 'axios';

import apiConfig from '../config/api';

const api = axios.create(apiConfig);

export default api;
