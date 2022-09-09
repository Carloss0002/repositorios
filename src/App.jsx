import { BrowserRouter } from "react-router-dom";
import Router from "./routes";

import GlobalStyle from './styles/global'


function App() {
  return (
    <>
       <BrowserRouter>
          <GlobalStyle/>
          <h1>Projetos</h1>
          <Router/>
       </BrowserRouter> 
    </>
  );
}

export default App;
