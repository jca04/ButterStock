import {Route, Routes} from 'react-router-dom';
import NotFound from './components/notFound';

function App() {
  return (
    <Routes>
        <Route  exact path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default App


