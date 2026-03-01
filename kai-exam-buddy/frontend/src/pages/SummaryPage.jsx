import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, FileText, Repeat, HelpCircle, ArrowRight } from 'lucide-react';
import api from '../api';

const QuizQuestionCard = ({ questionData, index }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (opt) => {
        if (!isSubmitted) setSelectedOption(opt);
    };

    const isCorrect = selectedOption === questionData.correct_answer;

    return (
        <div className="bg-slate-50/60 rounded-xl p-6 border border-slate-200/80 shadow-sm">
            <p className="text-lg font-medium text-slate-900 mb-5 leading-relaxed">
                <span className="text-primary-600 font-bold mr-2">{index + 1}.</span> {questionData.question}
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {questionData.options.map((opt, i) => {
                    let btnClass = "px-4 py-3 rounded-xl border text-left transition-colors font-medium text-sm leading-snug ";

                    if (isSubmitted) {
                        if (opt === questionData.correct_answer) {
                            btnClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-800";
                        } else if (opt === selectedOption) {
                            btnClass += "bg-red-500/10 border-red-500/50 text-red-800";
                        } else {
                            btnClass += "bg-white border-slate-200/50 text-slate-600 opacity-60";
                        }
                    } else {
                        if (opt === selectedOption) {
                            btnClass += "bg-primary-600/20 border-primary-500 text-primary-800";
                        } else {
                            btnClass += "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100";
                        }
                    }

                    return (
                        <button key={i} onClick={() => handleSelect(opt)} disabled={isSubmitted} className={btnClass}>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {!isSubmitted && selectedOption && (
                <button
                    onClick={() => setIsSubmitted(true)}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-slate-900 rounded-lg text-sm font-semibold transition-colors shadow-sm active:scale-[0.98]"
                >
                    Confirm Answer
                </button>
            )}

            {isSubmitted && (
                <div className={`p-4 rounded-xl mt-2 text-sm ${isCorrect ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/30' : 'bg-red-500/10 text-red-800 border border-red-500/30'}`}>
                    <p className="font-bold mb-1.5 text-base">{isCorrect ? 'Correct!' : 'Incorrect'}</p>
                    <p className="text-slate-700 leading-relaxed opacity-90">{questionData.explanation}</p>
                </div>
            )}
        </div>
    );
};

function SummaryPage() {
    const { docId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sequentially to prevent dual LLM execution on exactly same timestamp 
                // and efficiently utilize the backend caching mechanism in ai.py
                const summaryRes = await api.post(`/ai/${docId}/generate-summary`);
                const quizRes = await api.post(`/ai/${docId}/generate-quiz`);

                setData({
                    summary: summaryRes.data.summary,
                    // Treat likely questions as "Repeated Questions" for better contextual display per requirements
                    repeated_questions: summaryRes.data.likely_questions,
                    quiz_questions: quizRes.data.mcqs.slice(0, 5) // Select top 5 MCQs for interactive portion
                });

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to generate actionable insights. Ensure API keys and backend are valid.");
                setLoading(false);
            }
        };

        fetchData();
    }, [docId]);

    const handleGenerateQuiz = () => {
        navigate(`/classroom?docId=${docId}`);
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
                <img src="/logo.png" alt="Processing" className="w-16 h-16 animate-pulse mb-6 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Processing Intelligence</h2>
                <p className="text-slate-600">Synthesizing structure, repeating questions, and quiz materials...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-white/80 p-8 rounded-2xl border border-red-500/30 max-w-lg text-center shadow-lg">
                    <h2 className="text-xl font-bold text-red-400 mb-3">Synthesis Failed</h2>
                    <p className="text-slate-700 text-sm leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in slide-up duration-500">

            {/* Header section (Flat, structured, calm) */}
            <div className="bg-white/60 rounded-2xl p-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Master Study Guide</h1>
                    <p className="text-slate-600">Distilled intelligence. Calm, focused, and structured.</p>
                </div>
                <button
                    onClick={handleGenerateQuiz}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-slate-900 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-2"
                >
                    <span>Form a Classroom</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-col gap-10">
                {/* 1. Executive Summary */}
                <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-slate-100/50 rounded-lg">
                            <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        Executive Summary
                    </h2>
                    <div className="prose prose-invert max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {data.summary}
                    </div>
                </section>

                {/* 2. Repeated Questions */}
                <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-slate-100/50 rounded-lg">
                            <Repeat className="w-5 h-5 text-primary-600" />
                        </div>
                        Repeated Questions
                    </h2>
                    <div className="grid gap-4">
                        {data.repeated_questions.map((q, idx) => (
                            <div key={idx} className="bg-slate-50/60 p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                                <p className="text-slate-700 font-medium leading-relaxed">
                                    <span className="text-primary-600 font-bold mr-3">{idx + 1}.</span>
                                    {q}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Quiz Questions */}
                <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-slate-100/50 rounded-lg">
                            <HelpCircle className="w-5 h-5 text-primary-600" />
                        </div>
                        Quiz Questions
                    </h2>
                    <div className="space-y-6">
                        {data.quiz_questions.map((q, idx) => (
                            <QuizQuestionCard key={idx} questionData={q} index={idx} />
                        ))}
                    </div>
                </section>
            </div>

        </div>
    );
}

export default SummaryPage;
