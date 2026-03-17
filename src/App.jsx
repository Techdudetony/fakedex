import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="text-white p-8">FakeDex Loading...</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App