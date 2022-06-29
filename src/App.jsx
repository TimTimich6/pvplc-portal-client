import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/Header";
import Reports from "./pages/Reports";
import { ReportsContextProvider } from "./context/reportsContext";
import { AuthContextProvider } from "./context/authContext";
import { CookiesProvider } from "react-cookie";
import Account from "./pages/Account";
import RequireAuth from "./components/RequireAuth";
import Admin from "./pages/Admin";
import NewReport from "./pages/NewReport";
import ReportList from "./components/ReportList";
import ViewReport from "./components/ViewReport";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ReportsContextProvider>
          <AuthContextProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="login" element={<Login />} />

              <Route element={<RequireAuth allowedRoles={["ADMIN", "VOLUNTEER", "MOD"]} />}>
                <Route path="reports" element={<Reports />}>
                  <Route path=":id" element={<ViewReport />} />
                  <Route index element={<ReportList />} />
                </Route>
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "VOLUNTEER", "MOD"]} />}>
                <Route path="create" element={<NewReport />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "VOLUNTEER", "MOD"]} />}>
                <Route path="account" element={<Account />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
                <Route path="admin" element={<Admin />} />
              </Route>
            </Routes>
          </AuthContextProvider>
        </ReportsContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
