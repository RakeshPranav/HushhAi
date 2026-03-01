import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Trophy, ArrowRight, Zap, Target } from 'lucide-react';
import api from '../api';

function QuizPage() {
    const { code, quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userName, setUserName] = useState('');
    const [started, setStarted] = useState(false);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes default

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get(`/classroom/${code}/quizzes`);
                const found = res.data.quizzes.find(q => q.id === quizId);
                if (found) {
                    setQuiz(found.data);
                } else {
                    setError("Quiz not found.");
                }
                setLoading(false);
            } catch (err) {
                setError("Failed to load quiz.");
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [code, quizId]);

    useEffect(() => {
        let timer;
        if (started && !result && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !result) {
            handleSubmit();
        }
        return () => clearInterval(timer);
    }, [started, result, timeLeft]);

    const handleStart = (e) => {
        e.preventDefault();
        if (userName.trim()) setStarted(true);
    };

    const handleOptionSelect = (question, option) => {
        setAnswers(prev => ({ ...prev, [question]: option }));
    };

    const handleShortAnswerChange = (question, text) => {
        setAnswers(prev => ({ ...prev, [question]: text }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await api.post(`/quiz/${quizId}/attempt`, {
                user_name: userName,
                answers: answers
            });
            setResult(res.data);
        } catch (err) {
            setError("Failed to submit quiz.");
        }
        setSubmitting(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="flex-1 flex justify-center items-center min-h-[50vh]">
            <img src="/logo.png" alt="Loading" className="w-16 h-16 animate-pulse object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
        </div>
    );
    if (error) return <div className="text-center text-red-400 mt-20 text-lg bg-red-900/30 p-4 rounded-xl max-w-lg mx-auto border border-red-500/30">{error}</div>;
    if (!quiz) return null;

    const totalQuestions = quiz.mcqs.length + quiz.short_questions.length;
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    if (result) {
        return (
            <div className="max-w-3xl mx-auto py-16 text-center animate-in zoom-in duration-700">

                <div className="glass-card rounded-[3rem] p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 p-1 rounded-full mx-auto mb-8 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
                        <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center">
                            <Trophy className="w-12 h-12 text-yellow-600" />
                        </div>
                    </div>

                    <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Mission Accomplished</h1>
                    <p className="text-2xl text-slate-600 mb-10">
                        You scored <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 text-6xl mx-2">{result.score}</span> out of {result.total}
                    </p>

                    <div className="w-full bg-slate-900/5 h-4 justify-center rounded-full mb-12 max-w-md mx-auto overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(result.score / result.total) * 100}%` }}
                        ></div>
                    </div>

                    <button
                        onClick={() => navigate(`/classroom/${code}/leaderboard?quizId=${quizId}`)}
                        className="group relative px-10 py-5 bg-yellow-500 text-slate-900 font-bold rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_0_60px_rgba(234,179,8,0.6)] transition-all flex items-center justify-center gap-3 mx-auto active:scale-95"
                    >
                        <span className="text-lg">View Global Leaderboard</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="max-w-lg mx-auto py-20 animate-in fade-in slide-up">
                <div className="glass-card p-10 rounded-[2.5rem] border-t-2 border-t-accent-500 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/20 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="w-20 h-20 bg-accent-500/20 text-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Prepare for Battle</h1>
                    <p className="text-slate-600 mb-8">Enter your alias to join the live ranking.</p>

                    <form onSubmit={handleStart} className="space-y-6 relative z-10">
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Student Alias"
                            className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-900/10 focus:border-accent-500 outline-none text-slate-900 text-center text-xl font-bold transition-colors"
                            required
                        />
                        <button type="submit" className="w-full py-4 bg-accent-600 text-slate-900 rounded-2xl font-bold hover:bg-accent-500 transition-colors shadow-lg shadow-accent-500/20 text-lg">
                            Initialize Exam
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-500 relative">

            {/* Sticky Progress Header */}
            <div className="sticky top-24 z-30 mb-10 bg-slate-50/80 backdrop-blur-xl border border-slate-900/10 p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">luminaIq Live Exam</h2>
                        <p className="text-slate-600 font-medium text-sm">Agent: <span className="text-accent-600">{userName}</span></p>
                    </div>
                </div>

                {/* Timer Component */}
                <div className="flex items-center gap-2 bg-white border border-slate-900/5 px-4 py-2 rounded-xl font-mono text-xl font-bold tracking-widest text-slate-900 shadow-inner">
                    {formatTime(timeLeft)}
                    {timeLeft < 300 && <span className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping top-0 right-0 -mt-1 -mr-1"></span>}
                </div>

                <div className="w-full md:w-auto flex-1 max-w-xs text-right hidden sm:block">
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-primary-600">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-600 to-accent-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

            </div>

            <div className="space-y-12 pb-32">
                {/* MCQs */}
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/20 rounded-full mb-8">
                        <CheckCircle2 className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-bold text-primary-600 uppercase tracking-widest">Section 1: Multiple Choice</h3>
                    </div>

                    <div className="space-y-8">
                        {quiz.mcqs.map((mcq, idx) => (
                            <div key={idx} className="glass-card rounded-[2rem] p-8 md:p-10 border border-slate-900/5 group hover:border-slate-900/10 transition-colors relative overflow-hidden">
                                {answers[mcq.question] && <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/20 blur-[40px] rounded-full pointer-events-none"></div>}

                                <p className="text-xl font-semibold mb-8 text-slate-900 leading-relaxed">
                                    <span className="text-primary-500 font-mono mr-3 text-2xl font-black">{idx + 1}.</span>
                                    {mcq.question}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {mcq.options.map((opt, oIdx) => {
                                        const isSelected = answers[mcq.question] === opt;
                                        return (
                                            <label
                                                key={oIdx}
                                                className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 
                         ${isSelected
                                                        ? 'border-accent-500 bg-accent-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]'
                                                        : 'border-slate-900/10 bg-slate-50 hover:bg-slate-100/80 hover:border-white/20'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${idx}`}
                                                    value={opt}
                                                    checked={isSelected}
                                                    onChange={() => handleOptionSelect(mcq.question, opt)}
                                                    className="hidden"
                                                />
                                                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center transition-colors 
                           ${isSelected ? 'border-accent-500' : 'border-slate-500'}`}>
                                                    {isSelected && <div className="w-3 h-3 bg-accent-500 rounded-full animate-in zoom-in duration-200"></div>}
                                                </div>
                                                <span className={`text-lg ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>{opt}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Short Answers */}
                <div className="pt-8 border-t border-slate-900/10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
                        <Target className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-purple-300 uppercase tracking-widest">Section 2: Written Response</h3>
                    </div>

                    <div className="space-y-8">
                        {quiz.short_questions.map((sq, idx) => {
                            const qNum = quiz.mcqs.length + idx + 1;
                            return (
                                <div key={idx} className="glass-card rounded-[2rem] p-8 md:p-10 border border-slate-900/5">
                                    <p className="text-xl font-semibold mb-6 text-slate-900 leading-relaxed">
                                        <span className="text-purple-500 font-mono mr-3 text-2xl font-black">{qNum}.</span>
                                        {sq.question}
                                    </p>
                                    <textarea
                                        rows="4"
                                        className="w-full p-5 text-lg rounded-2xl border border-slate-900/10 bg-slate-50/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-slate-900 placeholder-slate-600 transition-all resize-y"
                                        placeholder="Synthesize your answer here..."
                                        value={answers[sq.question] || ''}
                                        onChange={(e) => handleShortAnswerChange(sq.question, e.target.value)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Floating Submit Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 glass-panel border-t border-slate-900/10 z-30 flex justify-center animate-in slide-up duration-500 delay-300">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || answeredCount === 0}
                    className="group relative px-12 py-5 bg-white text-slate-900 text-xl font-extrabold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 w-full max-w-sm flex items-center justify-center gap-3 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {submitting ? (
                        <img src="/logo.png" alt="Loading" className="w-6 h-6 animate-spin mx-auto relative z-10 object-contain" />
                    ) : (
                        <>
                            <span className="relative z-10">Submit Mission</span>
                            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}

export default QuizPage;
