import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  IconPhoto,
  IconScan,
  IconCheck,
  IconX,
  IconArrowRight,
  IconFileText,
  IconLoader2,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  uploadPrescription,
  getPrescriptions,
  updatePrescriptionStatus,
} from "@/lib/api";
import type { PrescriptionResponse } from "@/lib/api";

export function PrescriptionDigitizer() {
  const [file, setFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [currentPrescription, setCurrentPrescription] =
    useState<PrescriptionResponse | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setIsLoading(true);
        const data = await getPrescriptions();
        setPrescriptions(data.prescriptions);
      } catch (err) {
        console.error("Failed to fetch prescriptions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploaded(true);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    try {
      setScanning(true);
      setError(null);

      // Upload and digitize the prescription
      const prescription = await uploadPrescription(
        file,
        patientName || "Unknown Patient"
      );

      setCurrentPrescription(prescription);
      setScanned(true);

      // Add to the list
      setPrescriptions((prev) => [prescription, ...prev]);
    } catch (err) {
      console.error("Failed to digitize prescription:", err);
      setError(
        err instanceof Error ? err.message : "Failed to digitize prescription"
      );
    } finally {
      setScanning(false);
    }
  };

  const handleVerify = async () => {
    if (!currentPrescription) return;

    try {
      await updatePrescriptionStatus(currentPrescription.id, {
        status: "Verified",
      });
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === currentPrescription.id
            ? { ...p, status: "Verified" as const }
            : p
        )
      );
      setCurrentPrescription({ ...currentPrescription, status: "Verified" });
    } catch (err) {
      console.error("Failed to verify prescription:", err);
    }
  };

  const handleReject = async () => {
    if (!currentPrescription) return;

    try {
      // For rejection, we set to Pending since "Rejected" isn't a valid backend status
      await updatePrescriptionStatus(currentPrescription.id, {
        status: "Pending",
      });
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === currentPrescription.id
            ? { ...p, status: "Pending" as const }
            : p
        )
      );
      // Reset the form
      setFile(null);
      setUploaded(false);
      setScanned(false);
      setCurrentPrescription(null);
    } catch (err) {
      console.error("Failed to reject prescription:", err);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploaded(false);
    setScanning(false);
    setScanned(false);
    setCurrentPrescription(null);
    setError(null);
    setPatientName("");
  };

  const handleSelectRecent = (rx: PrescriptionResponse) => {
    setCurrentPrescription(rx);
    setScanned(true);
    setUploaded(true);
    // Don't set file since we are viewing an existing one
    setFile(null);
    setError(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusColors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Digitized: "bg-blue-100 text-blue-700 border-blue-200",
    Verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-1">Prescription Digitizer</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Upload handwritten prescriptions to convert into structured digital
          format
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload / Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/60 overflow-hidden h-full">
            <div className="p-4 border-b border-border/60">
              <h2 className="font-semibold flex items-center gap-2">
                <IconPhoto size={18} className="text-primary" />
                Prescription Image
              </h2>
            </div>
            <div className="p-6">
              {!uploaded ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Patient Name (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      placeholder="Enter patient name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>
                  <label
                    htmlFor="rx-upload"
                    className="flex flex-col items-center justify-center gap-4 p-16 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <IconPhoto size={28} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Upload prescription image</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PNG, JPG, or PDF • Max 10MB
                      </p>
                    </div>
                    <input
                      id="rx-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File info display */}
                  <div className="rounded-xl border border-border/60 overflow-hidden min-h-[300px] flex flex-col relative group">
                    {currentPrescription?.image_url ? (
                      <img
                        src={currentPrescription.image_url}
                        alt="Prescription"
                        className="w-full h-[400px] object-contain bg-black/5"
                      />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30">
                        <IconPhoto size={48} className="text-primary mb-4" />
                        <p className="font-medium text-center">
                          {file?.name || "Image available in list below"}
                        </p>
                        {file && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    )}

                    {!scanned && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full shadow-lg"
                          onClick={resetForm}
                        >
                          <IconX size={14} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm flex items-center gap-2">
                      <IconAlertTriangle size={18} />
                      {error}
                    </div>
                  )}

                  {!scanned && (
                    <Button
                      onClick={handleScan}
                      disabled={scanning}
                      className="w-full gap-2"
                    >
                      {scanning ? (
                        <>
                          <IconLoader2 size={16} className="animate-spin" />
                          Digitizing with AI...
                        </>
                      ) : (
                        <>
                          <IconScan size={16} /> Digitize Prescription
                        </>
                      )}
                    </Button>
                  )}

                  {scanned && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="w-full gap-2"
                    >
                      <IconPhoto size={16} /> Upload Another
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Structured Output Side */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/60 overflow-hidden h-full">
            <div className="p-4 border-b border-border/60">
              <h2 className="font-semibold flex items-center gap-2">
                <IconFileText size={18} className="text-chart-1" />
                Structured Output
                {scanned && currentPrescription && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
                    <IconCheck size={12} className="mr-0.5" />{" "}
                    {currentPrescription.status}
                  </Badge>
                )}
              </h2>
            </div>
            <div className="p-6">
              {!scanned || !currentPrescription ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <IconArrowRight
                      size={24}
                      className="text-muted-foreground"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {uploaded
                      ? "Click 'Digitize Prescription' to extract medication data"
                      : "Upload a prescription image to begin"}
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Patient</p>
                    <p className="font-medium">
                      {currentPrescription.patient_name}
                    </p>
                  </div>
                  {currentPrescription.medications &&
                  currentPrescription.medications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/40 text-xs text-muted-foreground">
                            <th className="text-left p-2.5 font-medium">
                              Drug
                            </th>
                            <th className="text-left p-2.5 font-medium">
                              Dosage
                            </th>
                            <th className="text-left p-2.5 font-medium">
                              Freq
                            </th>
                            <th className="text-left p-2.5 font-medium">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPrescription.medications.map((med, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + i * 0.08 }}
                              className="border-b border-border/20"
                            >
                              <td className="p-2.5 font-medium">{med.drug}</td>
                              <td className="p-2.5 text-muted-foreground">
                                {med.dosage}
                              </td>
                              <td className="p-2.5 text-muted-foreground">
                                {med.frequency}
                              </td>
                              <td className="p-2.5 text-muted-foreground">
                                {med.duration || "As prescribed"}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No medications extracted from prescription
                    </p>
                  )}
                  {currentPrescription.status !== "Verified" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={handleVerify}
                      >
                        <IconCheck size={14} /> Verify & Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={handleReject}
                      >
                        <IconX size={14} /> Reject
                      </Button>
                    </div>
                  )}

                  {currentPrescription.status === "Verified" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mt-2"
                      onClick={resetForm}
                    >
                      <IconScan size={16} /> New Scan
                    </Button>
                  )}
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Prescriptions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/60">
            <h2 className="font-semibold">Recent Prescriptions</h2>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No prescriptions digitized yet
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    currentPrescription?.id === rx.id
                      ? "bg-primary/5 border-l-2 border-primary"
                      : "hover:bg-muted/30"
                  }`}
                  onClick={() => handleSelectRecent(rx)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        currentPrescription?.id === rx.id
                          ? "bg-primary/10"
                          : "bg-muted/50"
                      }`}
                    >
                      <IconFileText
                        size={16}
                        className={
                          currentPrescription?.id === rx.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{rx.patient_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {rx.medications?.length || 0} medications •{" "}
                        {rx.created_at
                          ? new Date(rx.created_at).toLocaleDateString()
                          : rx.date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusColors[rx.status] || ""}`}
                  >
                    {rx.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
