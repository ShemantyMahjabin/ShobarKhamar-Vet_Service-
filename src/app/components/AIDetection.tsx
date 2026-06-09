import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AIDetection() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<null | {
    disease: string;
    confidence: number;
    severity: string;
    suggestedMode: string;
    recommendations: string[];
  }>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        disease: 'Suspected foot-and-mouth disease',
        confidence: 89,
        severity: 'High priority',
        suggestedMode: 'Same-day farm visit or video consultation',
        recommendations: [
          'Isolate the symptomatic animal immediately',
          'Book a veterinarian for confirmation and medication',
          'Monitor fever, mouth lesions, and walking pattern',
          'Disinfect feeding tools and contact surfaces',
        ],
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FCFA] px-6 py-6">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/farmer-dashboard')}
          className="mb-4 rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back to dashboard
        </button>

        <h1 className="text-3xl font-black text-[#17212B]">AI Disease Detection</h1>
        <p className="mt-2 text-sm font-medium text-[#6B7785]">
          Upload photos or describe symptoms for a preliminary livestock health review.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-[#DCE7DF] bg-white p-6">
            <h2 className="text-lg font-extrabold text-[#17212B]">Upload animal photos</h2>
            <div className="mt-4 rounded-[24px] border-2 border-dashed border-[#90caf9] bg-[#EAF3FB] p-8 text-center">
              <p className="text-sm font-bold text-[#0F4C81]">Click to upload or drag and drop</p>
              <p className="mt-2 text-xs font-medium text-[#6B7785]">Supports JPG and PNG up to 10MB</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#DCE7DF] bg-white p-6">
            <h2 className="text-lg font-extrabold text-[#17212B]">Describe symptoms</h2>
            <textarea
              rows={7}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe appetite loss, fever, lesions, breathing, mobility, or other visible changes."
              className="mt-4 w-full rounded-[20px] border border-[#DCE7DF] p-4 text-sm text-[#17212B] focus:outline-none resize-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="mt-4 w-full rounded-2xl bg-[#0F4C81] px-4 py-3 text-sm font-bold text-white disabled:opacity-70"
            >
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-[28px] border border-[#F5A524] bg-[#FFF5DF] p-6">
            <p className="text-sm font-bold text-[#F5A524]">Confidence: {result.confidence}%</p>
            <h2 className="mt-2 text-2xl font-black text-[#17212B]">{result.disease}</h2>
            <p className="mt-2 text-sm font-semibold text-[#6B7785]">Severity: {result.severity}</p>
            <p className="mt-1 text-sm font-semibold text-[#6B7785]">
              Suggested consultation type: {result.suggestedMode}
            </p>

            <div className="mt-4 space-y-2">
              {result.recommendations.map((recommendation) => (
                <div
                  key={recommendation}
                  className="rounded-[18px] bg-white px-4 py-3 text-sm font-semibold text-[#17212B]"
                >
                  {recommendation}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/booking')}
                className="rounded-2xl bg-[#1E9E6F] px-5 py-3 text-sm font-bold text-white"
              >
                Book vet appointment
              </button>
              <button
                onClick={() => navigate('/diagnosis-report')}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#17212B] border border-[#DCE7DF]"
              >
                View diagnosis report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
