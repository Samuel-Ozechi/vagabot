"use client";

import { useState, useRef } from "react"; // Added useRef
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ExternalLink, Globe, Sparkles, MapPin, Loader2, Compass, Send, Download } from "lucide-react"; // Added Download
import ReactMarkdown from "react-markdown"; 
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function VagaBotUI() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const resultRef = useRef<HTMLDivElement>(null); // Ref for the PDF capture

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("https://vagabot-m96k.onrender.com/api/v1/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();
      setResult(data?.response || data?.data?.response || "No response received");
    } catch (err) {
      setResult("The service is currently reaching its destination. Please try again in a moment.");
    }
    setLoading(false);
  };

  const downloadPDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let cursorY = 20;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - (margin * 2);

  const addNewPage = () => {
    pdf.addPage();
    pdf.setFillColor(3, 7, 18);
    pdf.rect(0, 0, 210, 297, "F");
    cursorY = 20;
  };

  // Initial Dark Background
  pdf.setFillColor(3, 7, 18);
  pdf.rect(0, 0, 210, 297, "F");

  // Header
  pdf.setTextColor(96, 165, 250);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("VAGABOT ITINERARY", margin, cursorY);
  cursorY += 15;

  // Process the content
  const lines = result.split("\n");

  lines.forEach((line) => {
    const cleanLine = line.trim();
    if (!cleanLine) {
      cursorY += 5; // Add space for empty lines
      return;
    }

    // 1. Logic to define styles based on content
    if (cleanLine.startsWith("#") || cleanLine.toUpperCase() === cleanLine) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      cursorY += 5;
    } else if (cleanLine.startsWith("•") || cleanLine.startsWith("-")) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(226, 232, 240);
    } else {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(148, 163, 184);
    }

    const formattedLine = cleanLine.replace(/(\d{1,3}(,\d{3})*)\s+\1/g, "$1");
    const textLines = pdf.splitTextToSize(formattedLine.replace(/[#*]/g, ""), maxLineWidth);

    if (cursorY + (textLines.length * 7) > 275) {
      addNewPage();
    }

    pdf.text(textLines, margin, cursorY);
    cursorY += (textLines.length * 7);
  });

  pdf.save(`VagaBot-Itinerary-${new Date().toLocaleDateString()}.pdf`);
};

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Hero Section */}
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
              VagaBot
            </h1>
            <p className="mt-4 text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              An advanced <span className="text-blue-400 font-medium">multi-agent orchestration engine</span> that synthesizes real-time data to provide personalized vacation itineraries.
            </p>
          </motion.div>
        </header>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-3xl"
        >
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl">
              <Compass className="ml-4 text-slate-500 w-6 h-6" />
              <Input
                placeholder="Where to next? (e.g. A weekend in Tokyo on a budget)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-grow bg-transparent border-none text-white text-lg focus-visible:ring-0 placeholder:text-slate-600 py-6"
              />
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-white text-black hover:bg-slate-200 rounded-xl px-6 py-6 transition-all flex items-center gap-2 group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="hidden md:inline font-bold">Generate</span><Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {(loading || result) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 w-full max-w-4xl"
            >
              <div className="flex justify-end mb-4">
                {result && !loading && (
                  <Button 
                    onClick={downloadPDF}
                    variant="outline" 
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </Button>
                )}
              </div>
              <Card className="bg-[#0f172a]/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <CardContent className="p-8 md:p-12" ref={resultRef}>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                      <div className="relative">
                         <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                         <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 w-6 h-6 animate-pulse" />
                      </div>
                      <p className="text-slate-400 font-medium tracking-wide">Orchestrating agents...</p>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="prose prose-invert prose-slate max-w-none 
                      prose-headings:text-white 
                      prose-headings:font-bold 
                      prose-p:text-slate-300 
                      prose-strong:text-blue-400"
                    >
                      <ReactMarkdown>{result}</ReactMarkdown>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Matrix Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl"
        >
          <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 hover:border-blue-500/30 transition-colors">
            <Sparkles className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Smart Synthesis</h3>
            <p className="text-slate-400 leading-relaxed font-light">Autonomous multi-agent orchestration that synthesizes real-time global data to provide personalized travel itineraries.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 hover:border-purple-500/30 transition-colors">
            <MapPin className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Location Intelligence</h3>
            <p className="text-slate-400 leading-relaxed font-light">Deep-linking regional attraction telemetry with curated hospitality inventory for a high-fidelity experience.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 hover:border-emerald-500/30 transition-colors">
            <Globe className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Adaptive Constraints</h3>
            <p className="text-slate-400 leading-relaxed font-light">Dynamic adjustment for budget, visa requirements, and seasonal accessibility for risk-mitigated planning.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 hover:border-orange-500/30 transition-colors">
            <Compass className="w-8 h-8 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Algorithmic Pacing</h3>
            <p className="text-slate-400 leading-relaxed font-light">Intelligent activity sequencing designed to optimize transit windows without logistical fatigue.</p>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20 py-12 bg-black/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-xl tracking-tighter">Samuel Ozechi</p>
          </div>
          <div className="flex gap-8">
            <a href="mailto:ozechisamuel@gmail.com" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"><Mail className="w-4 h-4" /> Email</a>
            <a href="https://samuel-ozechi.github.io/" target="_blank" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"><ExternalLink className="w-4 h-4" /> Portfolio</a>
          </div>
          <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">© {new Date().getFullYear()} VagaBot Systems</p>
        </div>
      </footer>
    </div>
  );
}