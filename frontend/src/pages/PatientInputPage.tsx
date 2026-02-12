import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  IconKeyboard,
  IconMicrophone,
  IconUpload,
  IconSend,
  IconPlayerStop,
  IconPhoto,
  IconX,
  IconLoader2,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createPatient } from "@/lib/api";

type Tab = "text" | "voice" | "upload";

export function PatientInputPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "text", label: "Text Input", icon: IconKeyboard },
    { key: "voice", label: "Voice Input", icon: IconMicrophone },
    { key: "upload", label: "Upload Prescription", icon: IconUpload },
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !symptoms.trim() || !age || !gender) {
      setError(
        "Please fill in all required fields (Name, Symptoms, Age, Gender)",
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const patient = await createPatient({
        name: name.trim(),
        age: parseInt(age, 10),
        gender: gender as "Male" | "Female" | "Other",
        symptoms: symptoms.trim(),
        medical_history: medicalHistory.trim() || undefined,
        vitals: {
          blood_pressure: bloodPressure || "120/80",
          heart_rate: heartRate ? parseInt(heartRate, 10) : 72,
          temperature: temperature ? parseFloat(temperature) : 98.6,
          oxygen_saturation: oxygenSaturation
            ? parseInt(oxygenSaturation, 10)
            : 98,
        },
      });

      setSubmitted(true);

      // Navigate to patient summary after a brief success message
      setTimeout(() => {
        navigate(`/patient/${patient.id}`);
      }, 1500);
    } catch (err) {
      console.error("Failed to create patient:", err);
      setError(err instanceof Error ? err.message : "Failed to create patient");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setRecordTime(0);
    } else {
      setRecording(true);
      const interval = setInterval(() => {
        setRecordTime((t) => {
          if (t >= 30) {
            clearInterval(interval);
            setRecording(false);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">Patient Input</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter patient symptoms via text, voice recording, or upload a
          prescription image
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-muted/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Error notification */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm flex items-center gap-2"
        >
          <IconAlertCircle size={18} />
          {error}
        </motion.div>
      )}

      {/* Success notification */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-4 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm"
        >
          ✓ Patient data submitted successfully! AI analysis in progress...
        </motion.div>
      )}

      {/* Text Input Tab */}
      {activeTab === "text" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="p-6 border-border/60">
            <h3 className="font-semibold mb-4">Patient Information</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="45"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender *</Label>
                <div className="flex gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
                        gender === g
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="history">Medical History</Label>
                <Input
                  id="history"
                  placeholder="Diabetes, Hypertension..."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/60">
            <h3 className="font-semibold mb-4">Symptom Description *</h3>
            <Textarea
              placeholder="Describe the patient's symptoms in detail... (e.g., 'Patient reports severe chest pain radiating to left arm, started 2 hours ago, accompanied by shortness of breath and sweating')"
              className="min-h-[140px] resize-none"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                Be as detailed as possible for accurate triage
              </span>
              <span className="text-xs text-muted-foreground">
                {symptoms.length} chars
              </span>
            </div>
          </Card>

          <Card className="p-6 border-border/60">
            <h3 className="font-semibold mb-4">Vitals (Optional)</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp">Blood Pressure</Label>
                <Input
                  id="bp"
                  placeholder="120/80"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hr">Heart Rate (bpm)</Label>
                <Input
                  id="hr"
                  type="number"
                  placeholder="72"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp">Temperature (°F)</Label>
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="o2">O₂ Saturation (%)</Label>
                <Input
                  id="o2"
                  type="number"
                  placeholder="98"
                  value={oxygenSaturation}
                  onChange={(e) => setOxygenSaturation(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Button onClick={handleSubmit} className="gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <IconLoader2 size={16} className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <IconSend size={16} /> Submit for AI Analysis
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Voice Input Tab */}
      {activeTab === "voice" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-8 border-border/60 text-center">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Voice Recording</h3>
              <p className="text-sm text-muted-foreground">
                Tap the microphone and describe the patient's symptoms
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <motion.button
                onClick={toggleRecording}
                whileTap={{ scale: 0.95 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  recording
                    ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
                    : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                }`}
              >
                {recording ? (
                  <IconPlayerStop size={36} />
                ) : (
                  <IconMicrophone size={36} />
                )}
              </motion.button>

              {recording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-destructive rounded-full"
                        animate={{
                          height: [12, 24, 12],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-destructive">
                    Recording — {recordTime}s
                  </span>
                </motion.div>
              )}

              {!recording && recordTime === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Tap to start recording symptoms
                </Badge>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 border-border/60">
            <h3 className="font-semibold mb-4">Upload Prescription Image</h3>

            {!uploadedFile ? (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <IconPhoto size={28} className="text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Drop prescription image here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse • PNG, JPG, PDF up to 10MB
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUploadedFile(file.name);
                  }}
                />
              </label>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl border border-primary/20 bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <IconPhoto size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{uploadedFile}</p>
                    <p className="text-xs text-muted-foreground">
                      Ready for digitization
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setUploadedFile(null)}
                  >
                    <IconX size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {uploadedFile && (
              <Button onClick={handleSubmit} className="gap-2 mt-4">
                <IconSend size={16} /> Digitize Prescription
              </Button>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
