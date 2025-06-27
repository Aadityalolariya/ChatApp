import { BE_URL } from './constants.js';
import axios from "axios";
import Cookies from "js-cookie";

const call_api = axios.create({
  baseURL: BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
call_api.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // or get from context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const construct_url = (api_name, parameters) => {
  let url = api_name;
  if(parameters != null){
    url = url + '?';
    for(let key in parameters){
      url = `${key}=${parameters[key]}&`;
    }
    url = url.slice(0, -1); // Removes the last &
  }
  return url;
}

const call_backend = async (api_name, api_method = 'GET', json_data = null, parameters = null, header = null) => {
  let status = false;
  let response = null;
  try{
    let url = api_name;
    if(parameters != null){
      url = construct_url(api_name, parameters);
    }
    if(api_method == 'GET'){
      response = await call_api.get(url);
    }
    else if (api_method == 'DELETE'){
      response = await call_api.delete(url);
    }
    else if(api_method == 'POST'){
      response = await call_api.post(url, json_data);
    }

    if(response.status == 200 && response.data['status'] == 'success'){
      status = true;
      response = response.data;
    }
    else{
      status = false;
    }
  }
  catch(err){
    console.log(`Error occurred while calling api: ${api_name}: ${err}`);
  }
  return {
    "status": status,
    "response": response
  }
}

export { call_api, call_backend };