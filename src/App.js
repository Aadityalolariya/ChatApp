import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Main from './components/Main/Main';
import SignIn from './components/SignIn/SignIn';
function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element = {<Home/>} />
          <Route exact path='/main' element = {<Main/>} />
          <Route exact path='/signin' element = {<SignIn/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
