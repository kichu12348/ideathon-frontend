import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { TeamsList } from './pages/TeamsList/TeamsList';
import { TeamDetail } from './pages/TeamDetail/TeamDetail';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<TeamsList />} />
          <Route path="/team/:teamId" element={<TeamDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
