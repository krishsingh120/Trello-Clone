// Wires the router and global providers for the frontend application.
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BoardProvider } from './context/BoardContext';
import { SearchProvider } from './context/SearchContext';
import BoardPage from './pages/BoardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <BoardProvider>
          <Routes>
            <Route path="/" element={<BoardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BoardProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}
