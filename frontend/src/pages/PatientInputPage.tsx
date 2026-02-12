import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
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
  IconSparkles,
  IconWaveSine,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createPatient } from "@/lib/api";
import { transcribeVoice } from "@/lib/api/patients";
import { uploadPrescription } from "@/lib/api/prescriptions";
import { toast } from "sonner";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDigitizing, setIsDigitizing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "text", label: "Text Input", icon: IconKeyboard },
    { key: "voice", label: "Voice Input", icon: IconMicrophone },
    { key: "upload", label: "Upload Prescription", icon: IconUpload },
  ];

  const handleDigitize = async () => {
    if (!selectedFile) return;

    try {
      setIsDigitizing(true);
      setError(null);

      // We use "Prescription Upload" as a placeholder name since we'll extract the real one
      const result = await uploadPrescription(selectedFile, "New Patient");

      if (result.extracted_patient_name) {
        setName(result.extracted_patient_name);
      }
      if (result.extracted_age) {
        setAge(result.extracted_age.toString());
      }
      if (result.extracted_gender) {
        setGender(result.extracted_gender);
      }

      // Append medications to symptoms or medical history
      if (result.medications && result.medications.length > 0) {
        const medsList = result.medications
          .map((m) => `• ${m.drug} (${m.dosage}, ${m.frequency})`)
          .join("\n");

        setSymptoms((prev) =>
          prev
            ? `${prev}\n\nPrescription Medications:\n${medsList}`
            : `Prescription Medications:\n${medsList}`
        );
      }

      toast.success("Prescription digitized successfully! Form updated.");
      setActiveTab("text"); // Switch back to text to review the data
    } catch (err) {
      console.error("Digitization failed:", err);
      setError(
        "AI was unable to read the prescription. Please try a clearer image or use manual entry."
      );
    } finally {
      setIsDigitizing(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !symptoms.trim() || !age || !gender) {
      setError(
        "Please fill in all required fields (Name, Symptoms, Age, Gender)"
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine best supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/ogg")
            ? "audio/ogg"
            : "";

      console.log("🎤 Selected MIME type:", mimeType);

      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : {}
      );
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const finalType = mediaRecorder.mimeType || "audio/webm";
        console.log(
          `🎤 Recording stopped. Type: ${finalType}, Chunks: ${audioChunksRef.current.length}`
        );

        const audioBlob = new Blob(audioChunksRef.current, { type: finalType });
        await handleTranscription(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      // Collect data every 200ms
      mediaRecorder.start(200);
      setRecording(true);
      setRecordTime(0);

      timerRef.current = setInterval(() => {
        setRecordTime((t) => {
          if (t >= 60) {
            stopRecording();
            return t;
          }
          return t + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast.error(
        "Microphone access denied. Please enable it in your browser settings."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    try {
      setIsTranscribing(true);
      const text = await transcribeVoice(blob);
      if (text) {
        setSymptoms((prev) =>
          prev ? `${prev}\n\nVoice Summary: ${text}` : text
        );
        toast.success("Voice transcribed successfully!");
        setActiveTab("text");
      }
    } catch (err) {
      console.error("Transcription failed:", err);
      toast.error("AI was unable to transcribe the audio. Please try again.");
    } finally {
      setIsTranscribing(false);
      setRecordTime(0);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="p-6">
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
          <Card className="p-8 border-border/60 text-center relative overflow-hidden">
            {isTranscribing && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                <IconLoader2 size={40} className="text-primary animate-spin" />
                <p className="text-sm font-medium">
                  AI is transcribing your voice...
                </p>
              </div>
            )}

            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="text-primary border-primary/20 bg-primary/5 gap-1.5"
                >
                  <IconSparkles size={12} />
                  AI Voice Transcription
                </Badge>
              </div>
              <h3 className="font-semibold text-xl mb-2">Record Symptoms</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Clearly describe the patient's symptoms, duration, and any
                observable signs.
              </p>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <AnimatePresence>
                  {recording && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0.2 }}
                      exit={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-destructive"
                    />
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={toggleRecording}
                  disabled={isTranscribing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all z-20 ${
                    recording
                      ? "bg-destructive text-destructive-foreground shadow-xl shadow-destructive/40"
                      : "bg-primary text-primary-foreground hover:shadow-xl hover:shadow-primary/40"
                  } ${isTranscribing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {recording ? (
                    <IconPlayerStop size={40} />
                  ) : (
                    <IconMicrophone size={40} />
                  )}
                </motion.button>
              </div>

              <div className="h-12 flex flex-col items-center justify-center gap-2">
                <AnimatePresence mode="wait">
                  {recording ? (
                    <motion.div
                      key="recording"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="flex gap-1.5 mb-1">
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 bg-destructive rounded-full"
                            animate={{
                              height: [16, 32, 16],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.08,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-destructive animate-pulse">
                        REC {Math.floor(recordTime / 60)}:
                        {(recordTime % 60).toString().padStart(2, "0")}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <p className="text-sm font-medium">
                        {isTranscribing
                          ? "Processing..."
                          : "Tap to start recording"}
                      </p>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                          <IconWaveSine size={12} /> Clear Audio
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                          <IconSparkles size={12} /> AI Powered
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upload Prescription Image</h3>
              <Badge
                variant="outline"
                className="text-primary border-primary/20 bg-primary/5 gap-1.5"
              >
                <IconSparkles size={12} />
                AI Auto-Fill
              </Badge>
            </div>

            {!selectedFile ? (
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
                    or click to browse • PNG, JPG, WebP up to 10MB
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
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
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready to
                      extract
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedFile(null)}
                    disabled={isDigitizing}
                  >
                    <IconX size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {selectedFile && (
              <Button
                onClick={handleDigitize}
                className="gap-2 mt-4 w-full sm:w-auto"
                disabled={isDigitizing}
              >
                {isDigitizing ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" />
                    AI is Reading Prescription...
                  </>
                ) : (
                  <>
                    <IconSparkles size={16} />
                    Auto-Fill from Prescription
                  </>
                )}
              </Button>
            )}

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              AI extraction creates a structured draft. Please review all fields
              before final submission.
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
