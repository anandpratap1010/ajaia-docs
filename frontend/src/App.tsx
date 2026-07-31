import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { EditorPage } from './pages/EditorPage'
export default function App() {
  return <Routes><Route path="/login" element={<LoginPage/>}/><Route element={<ProtectedRoute/>}><Route path="/documents" element={<DocumentsPage/>}/><Route path="/documents/:documentId" element={<EditorPage/>}/></Route><Route path="*" element={<Navigate to="/documents" replace/>}/></Routes>
}
