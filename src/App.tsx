import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CreatePoll from "./pages/CreatePoll";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PollDetails from "./pages/PollDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<CreatePoll />} />
          <Route path="poll/:pollId" element={<PollDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
