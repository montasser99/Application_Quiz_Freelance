import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './User/Home.jsx';
import AdminHome from './Admin/Home.jsx';
import Welcome from './Welcome.jsx';
import LoginPage from './Auth/Login.jsx';
import RegisterPage from './Auth/Register.jsx';
import Profile from './Profile/Profile.jsx';
import Language from './Language/Index.jsx';
import Quiz from './Quiz/Quiz.jsx';
import Questions from './Question/Questions.jsx';
import Affectation from './Quiz/Affectation.jsx';
import AffUser from './Quiz/AffUser.jsx';
import Index from './Historique/Index.jsx';
import PlayQuiz from './User/PlayQuiz/PlayQuiz.jsx';
import JoinPage from './CodeGeust/JoinPage.jsx';
import QuizGuest from './CodeGeust/QuizGuest.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}/>
        <Route path="Home" element={<Home />}/>
        <Route path="play" element={<PlayQuiz />}/>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<Profile />}/>
        <Route path="join" element={<JoinPage />}/>
        <Route path="quizguest/:code" element={<QuizGuest />} />

        {/* Admin Group Routes */}
        <Route path="admin">
          <Route index element={<AdminHome />} />
          <Route path="languages" element={<Language />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="quiz/questions" element={<Affectation />} />
          <Route path="quiz/users" element={<AffUser />} />
          <Route path="questions" element={<Questions />} />
          <Route path="historique" element={<Index />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
