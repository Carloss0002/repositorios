import {Routes, Route} from 'react-router-dom'

import Home from '../pages/Main'
import Repositorio from '../pages/Repositorio'

export default function Router(){
   return(
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/repositorio/:repositorio' element={<Repositorio/>}/>

         <Route path='*' element={<Home/>}/>
       </Routes>
   )
}