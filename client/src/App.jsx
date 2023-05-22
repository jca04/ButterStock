import {Route, Routes} from 'react-router-dom';
import NotFound from './components/notFound';
import LogginUser from './components/loginUsers'; 
import FormRestaurant from './components/createRestaurant';

function App() {
  return (
    <Routes>
        <Route exact path='*' element={<NotFound/>} />
        <Route exact path='/login' element={<LogginUser/>}/>
        <Route exact path='/createRestaurant' element={<FormRestaurant/>}/>
    </Routes>
  )
}

export default App


