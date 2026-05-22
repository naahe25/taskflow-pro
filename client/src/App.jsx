import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Admin from "./pages/Admin";
import Tasks from "./pages/Tasks";
import Team from "./pages/Team";




function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route

          path="/dashboard"

          element={

            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }

        />

        <Route

          path="/projects"

          element={

            <ProtectedRoute>

              <Projects />

            </ProtectedRoute>
          }

        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route

          path="/Admin"

          element={

            <ProtectedRoute>

              <Admin />

            </ProtectedRoute>
          }
        />

        <Route

          path="/tasks"

          element={

            <ProtectedRoute>

              <Tasks />

            </ProtectedRoute>
          }
        />

        <Route

          path="/team"

          element={

            <ProtectedRoute>

              <Team />

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;