"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Moon, 
  Zap, 
  Heart, 
  User, 
  Briefcase, 
  Scale, 
  Thermometer, 
  TrendingUp,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function HealthRiskApp() {
  const [formData, setFormData] = useState({
    Gender: 'Male',
    Age: 25,
    Occupation: 'Software Engineer',
    Sleep_Duration: 7.0,
    Quality_of_Sleep: 7,
    Physical_Activity_Level: 50,
    Stress_Level: 5,
    BMI_Category: 'Normal',
    Blood_Pressure: '120/80',
    Heart_Rate: 72,
    Daily_Steps: 8000,
    Sleep_Disorder: 'None'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const occupations = [
    'Software Engineer', 'Doctor', 'Sales Representative', 'Teacher', 
    'Nurse', 'Engineer', 'Accountant', 'Scientist', 'Lawyer', 
    'Salesperson', 'Manager'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['Age', 'Quality_of_Sleep', 'Physical_Activity_Level', 'Stress_Level', 'Heart_Rate', 'Daily_Steps', 'Sleep_Duration'].includes(name) 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
              Health Risk Assessment
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Analyze your lifestyle patterns using our advanced XGBoost AI to predict health risks and get personalized insights.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-medium text-neutral-400 gap-2">
                    <User size={16} /> Demographic
                  </label>
                  <div className="space-y-4">
                    <select 
                      name="Gender" 
                      value={formData.Gender} 
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <input 
                      type="number" 
                      name="Age" 
                      placeholder="Age" 
                      value={formData.Age} 
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                    <select 
                      name="Occupation" 
                      value={formData.Occupation} 
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    >
                      {occupations.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                    </select>
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-medium text-neutral-400 gap-2">
                    <Zap size={16} /> Activity & Sleep
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        name="Sleep_Duration" 
                        placeholder="Sleep Duration (hrs)"
                        value={formData.Sleep_Duration} 
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-3 text-neutral-500 text-sm">hrs</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="Physical_Activity_Level" 
                        placeholder="Activity Level (min)"
                        value={formData.Physical_Activity_Level} 
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-3 text-neutral-500 text-sm">min</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="Daily_Steps" 
                        placeholder="Daily Steps"
                        value={formData.Daily_Steps} 
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-3 text-neutral-500 text-sm">steps</span>
                    </div>
                  </div>
                </div>

                {/* Health Metrics */}
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-medium text-neutral-400 gap-2">
                    <Heart size={16} /> Vitals
                  </label>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      name="Blood_Pressure" 
                      placeholder="Blood Pressure (e.g. 120/80)"
                      value={formData.Blood_Pressure} 
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                    <div className="relative">
                      <input 
                        type="number" 
                        name="Heart_Rate" 
                        placeholder="Heart Rate (bpm)"
                        value={formData.Heart_Rate} 
                        onChange={handleInputChange}
                        className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      />
                      <span className="absolute right-4 top-3 text-neutral-500 text-sm">bpm</span>
                    </div>
                    <select 
                      name="BMI_Category" 
                      value={formData.BMI_Category} 
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    >
                      <option value="Normal">Normal BMI</option>
                      <option value="Overweight">Overweight</option>
                      <option value="Obese">Obese</option>
                    </select>
                  </div>
                </div>

                {/* Mental & Disorders */}
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-medium text-neutral-400 gap-2">
                    <Activity size={16} /> Mental Health
                  </label>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-500 px-1">Stress Level (1-10)</span>
                      <input 
                        type="range" 
                        min="1" max="10"
                        name="Stress_Level" 
                        value={formData.Stress_Level} 
                        onChange={handleInputChange}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-neutral-500 px-1">Sleep Quality (1-10)</span>
                      <input 
                        type="range" 
                        min="1" max="10"
                        name="Quality_of_Sleep" 
                        value={formData.Quality_of_Sleep} 
                        onChange={handleInputChange}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <select 
                      name="Sleep_Disorder" 
                      value={formData.Sleep_Disorder} 
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    >
                      <option value="None">No Sleep Disorder</option>
                      <option value="Insomnia">Insomnia</option>
                      <option value="Sleep Apnea">Sleep Apnea</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Analyze Risk Level
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Section */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex flex-col items-center justify-center space-y-4 p-12 bg-neutral-900/30 rounded-3xl border border-neutral-800 border-dashed"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <Activity className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={24} />
                  </div>
                  <p className="text-neutral-400 font-medium">Crunching health data...</p>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex gap-4 text-red-400"
                >
                  <AlertCircle className="shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className={`p-8 rounded-3xl border ${
                    result.risk_level === 'High' ? 'bg-red-500/10 border-red-500/20' :
                    result.risk_level === 'Medium' ? 'bg-orange-500/10 border-orange-500/20' :
                    'bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm font-medium text-neutral-400 mb-1">Assessment Result</p>
                        <h2 className={`text-4xl font-bold ${
                          result.risk_level === 'High' ? 'text-red-400' :
                          result.risk_level === 'Medium' ? 'text-orange-400' :
                          'text-emerald-400'
                        }`}>
                          {result.risk_level} Risk
                        </h2>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md">
                        {result.risk_level === 'Low' ? <CheckCircle2 className="text-emerald-400" /> : <AlertCircle className="text-orange-400" />}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-400">Confidence Score</span>
                        <span className="text-white font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          className={`h-full ${
                            result.risk_level === 'High' ? 'bg-red-500' :
                            result.risk_level === 'Medium' ? 'bg-orange-500' :
                            'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Moon className="text-indigo-400" size={20} />
                        <h3 className="font-semibold text-white">Sleep Insight</h3>
                      </div>
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {formData.Sleep_Duration < 7 
                          ? "Your sleep duration is below the recommended 7-9 hours. Increasing this could significantly reduce your risk score."
                          : "Great job on maintaining a healthy sleep duration! Focus on consistency to keep your risk level low."}
                      </p>
                    </div>

                    <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="text-emerald-400" size={20} />
                        <h3 className="font-semibold text-white">Activity Pulse</h3>
                      </div>
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {formData.Daily_Steps < 5000
                          ? "Your daily steps are quite low. Try adding a 15-minute walk to your routine to boost your cardiovascular health."
                          : "Your activity level is excellent. Keep challenging yourself to maintain this metabolic momentum."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {!result && !loading && !error && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border border-neutral-800 border-dashed rounded-3xl"
                >
                  <Activity className="text-neutral-700 mb-4" size={48} />
                  <p className="text-neutral-500 italic">Fill out the form and analyze to see your results and personalized recommendations.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-neutral-600 text-sm">
            Powered by Next.js & XGBoost AI • Health Analysis Model v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
