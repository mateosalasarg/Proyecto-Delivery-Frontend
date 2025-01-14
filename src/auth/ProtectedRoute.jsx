import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';  // Importa AuthProvider
import Login from './pages/Login/Login';

function App() {
    return (
        <AuthProvider>  {/* Envuelve toda la app con AuthProvider */}
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
