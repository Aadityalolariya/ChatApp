import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/context.js';
import Home from './components/Home/Home';
import Main from './components/Main/Main';
import SignIn from './components/SignIn/SignIn';
function App() {
  

  return (
    <>
      {/* <WebSocketContext.Provider value={socketRef}> */}
        {/* <Test.Provider value={testValue}> */}
        <GlobalProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path='/' element = {<Home/>} />
              <Route exact path='/main' element = {<Main/>} />
              <Route exact path='/signin' element = {<SignIn/>} />
            </Routes>
          </BrowserRouter>
        </GlobalProvider>
        {/* </Test.Provider> */}
      {/* </WebSocketContext.Provider> */}
    </>
  );
}

export default App;
