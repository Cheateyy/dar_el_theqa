import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/buyer/components/Home';
{/*Put all your routers here */ }
function AppRouter() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
