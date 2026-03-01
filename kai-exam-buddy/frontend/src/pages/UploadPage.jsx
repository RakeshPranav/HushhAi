import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import api from '../api';

function UploadPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }
        setError('');
        setLoading(true);
        setProgress('Extracting testable knowledge...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await api.post('/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const docId = uploadRes.data.id;

            setProgress('luminaIq is crafting your master study guide...');
            setTimeout(() => {
                navigate(`/summary/${docId}`);
            }, 1500); // Small delay for animation effect

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Our AI encountered an error processing this file. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-12 animate-in fade-in slide-up hidden-scrollbar">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-primary-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <UploadCloud className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Feed the <span className="text-gradient">AI Brain</span></h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                    Drop your lecture slides or textbook chapters here. luminaIq will instantly digest it and prepare your personalized exam arsenal.
                </p>
            </div>

            <div
                className={`w-full relative rounded-[2.5rem] p-1 transition-all duration-500 ${isDragging ? 'bg-gradient-to-r from-primary-500 to-accent-500 scale-[1.02]' : 'bg-slate-900/10 hover:bg-slate-100/20'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className={`w-full glass-card rounded-[2.4rem] p-12 md:p-20 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-500 ${isDragging ? 'border-transparent bg-slate-50/80' :
                    file ? 'border-accent-500/50 bg-accent-500/5' :
                        'border-white/20 hover:border-primary-500/50'
                    }`}
                >
                    {!file ? (
                        <div className="flex flex-col items-center text-center">
                            <div className={`p-6 rounded-full mb-6 transition-all duration-500 ${isDragging ? 'bg-primary-500/30 scale-110' : 'bg-slate-900/5'}`}>
                                <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-primary-600 animate-bounce' : 'text-slate-600'}`} />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mb-3 tracking-wide">
                                {isDragging ? "Drop to ignite learning!" : "Drag & drop your magical notes"}
                            </p>
                            <p className="text-slate-600 mb-10 text-lg">Supports PDF, PPTX, JPG, PNG, or TXT</p>

                            <label className="cursor-pointer relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative px-8 py-4 bg-slate-50 border border-slate-900/10 text-slate-900 font-bold rounded-2xl flex items-center gap-2 hover:bg-slate-100 transition-colors">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Browse Files</span>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg,.txt" />
                            </label>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center animate-in zoom-in duration-300">
                            <div className="relative">
                                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 mx-auto max-w-4xl relative z-20">
                                    <div className="bg-slate-100/50 border border-slate-300 p-6 rounded-full mb-6 relative mx-auto w-fit">
                                        <FileText className="w-14 h-14 text-accent-600" />
                                    </div>
                                </div>
                            </div>

                            <p className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{file.name}</p>
                            <p className="text-slate-600 mb-10 font-mono bg-slate-900/5 px-4 py-1 rounded-full text-sm border border-slate-900/5">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for synthesis
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <button
                                    onClick={() => setFile(null)}
                                    className="px-8 py-4 bg-slate-900/5 border border-slate-900/10 text-slate-700 font-bold rounded-2xl hover:bg-slate-900/10 hover:text-slate-900 transition-all w-full sm:w-auto"
                                    disabled={loading}
                                >
                                    Choose Another File
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="group relative px-8 py-4 bg-primary-600 text-slate-900 font-bold rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {loading ? (
                                        <img src="/logo.png" alt="Loading" className="w-6 h-6 animate-spin relative z-10 object-contain" />
                                    ) : (
                                        <Sparkles className="w-6 h-6 relative z-10 text-yellow-300" />
                                    )}
                                    <span className="relative z-10">{loading ? "Processing..." : "Generate Insights"}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State Overlay / Indicator */}
            {loading && (
                <div className="mt-12 text-center animate-in fade-in duration-500 bg-primary-900/50 border border-primary-500/30 p-6 rounded-3xl backdrop-blur-md max-w-md w-full">
                    <img src="/logo.png" alt="Loading" className="w-16 h-16 animate-pulse mx-auto mb-4 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                    <p className="text-primary-600 font-bold text-xl">{progress}</p>
                    <div className="w-full bg-white rounded-full h-2 mt-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full w-full animate-[progress_2s_ease-in-out_infinite] origin-left scale-x-0" style={{ animationName: 'progressLoader' }}></div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-8 p-6 bg-red-900/50 border border-red-500/50 text-red-200 rounded-3xl max-w-2xl w-full flex items-center gap-4 animate-in slide-up">
                    <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <p className="text-lg">{error}</p>
                </div>
            )}

            <style jsx>{`
        @keyframes progressLoader {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
        </div>
    );
}

export default UploadPage;
