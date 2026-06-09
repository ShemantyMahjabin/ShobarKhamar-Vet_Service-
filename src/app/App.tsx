import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { FarmerDashboard } from './components/FarmerDashboard';
import { VetRegistration } from './components/VetRegistration';
import { VetDashboard } from './components/VetDashboard';
import { BookAppointment } from './components/BookAppointment';
import { VetProfile } from './components/VetProfile';
import { VetChatPage } from './components/VetChatPage';
import { DiseaseHeatmap } from './components/DiseaseHeatmap';
import { AIDetection } from './components/AIDetection';
import { FarmManagement } from './components/FarmManagement';
import { AddAnimal } from './components/AddAnimal';
import { AnimalDetails } from './components/AnimalDetails';
import { AddVaccine } from './components/AddVaccine';
import { VaccinationManagement } from './components/VaccinationManagement';
import { VaccinationCenters } from './components/VaccinationCenters';
import { GiveVaccine } from './components/GiveVaccine';
import { VaccinationSchedule } from './components/VaccinationSchedule';
import { FarmerProfile } from './components/FarmerProfile';
import { VaccinationRecords } from './components/VaccinationRecords';
import { DiagnosisReport } from './components/DiagnosisReport';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FCFA]">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/profile" element={<FarmerProfile />} />
          <Route path="/farm-management" element={<FarmManagement />} />
          <Route path="/farm-management/:animalId" element={<AnimalDetails />} />
          <Route path="/add-animal" element={<AddAnimal />} />
          <Route path="/add-vaccine" element={<AddVaccine />} />
          <Route path="/vaccination-management" element={<VaccinationManagement />} />
          <Route path="/vaccination-centers" element={<VaccinationCenters />} />
          <Route path="/give-vaccine" element={<GiveVaccine />} />
          <Route path="/vaccination-schedule" element={<VaccinationSchedule />} />
          <Route path="/vaccination-records" element={<VaccinationRecords />} />
          <Route path="/diagnosis-report" element={<DiagnosisReport />} />
          <Route path="/vet-registration" element={<VetRegistration />} />
          <Route path="/vet-dashboard" element={<VetDashboard />} />
          <Route path="/booking" element={<BookAppointment />} />
          <Route path="/booking/:vetId" element={<VetProfile />} />
          <Route path="/booking/:vetId/chat" element={<VetChatPage />} />
          <Route path="/heatmap" element={<DiseaseHeatmap />} />
          <Route path="/ai-detection" element={<AIDetection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
