import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Users, Award, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-12 animate-in fade-in slide-up duration-700">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/50 text-slate-700 text-sm font-medium mb-8 bg-white/50 shadow-sm">
                <span className="font-bold text-primary-600">luminaIq</span>
                <span className="text-slate-600">|</span>
                <span>Welcome to the future of studying</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight max-w-4xl leading-tight">
                Turn Your Notes Into <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 via-indigo-600 to-accent-600 animate-pulse-slow">
                    Competitive Study Battles
                </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
                Upload your PDFs or slides and let luminaIq instantly spark them into 1-page summaries, flashcards, likely exam questions, and multiplayer quizzes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24 w-full sm:w-auto">
                <Link to="/upload" className="group relative px-8 py-4 bg-primary-600 text-slate-900 font-bold rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Upload className="w-6 h-6 relative z-10 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative z-10 text-lg">Start Learning For Free</span>
                </Link>
                <Link to="/classroom" className="px-8 py-4 bg-slate-900/5 text-slate-900 font-bold rounded-2xl border border-slate-900/10 hover:border-white/20 hover:bg-slate-900/10 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 glass-card">
                    <Users className="w-6 h-6 text-accent-600" />
                    <span className="text-lg">Join a Classroom</span>
                </Link>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl text-left">

                <div className="glass-card rounded-3xl p-8 group glass-card-hover relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-primary-500/20"></div>
                    <div className="bg-primary-500/20 border border-primary-500/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
                        <Flame className="w-7 h-7 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-primary-600 transition-colors">Instant AI Summaries</h3>
                    <p className="text-slate-600 leading-relaxed">Turn exhaustive 100-page PDFs into punchy 1-page summaries highlighting strictly what's on the test.</p>
                    <ul className="mt-6 space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-primary-600" /> Core concepts extracted</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-primary-600" /> Exam questions predicted</li>
                    </ul>
                </div>

                <div className="glass-card rounded-3xl p-8 group glass-card-hover relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent-500/20"></div>
                    <div className="bg-accent-500/20 border border-accent-500/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent-500/20">
                        <Users className="w-7 h-7 text-accent-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-accent-300 transition-colors">Multiplayer Classrooms</h3>
                    <p className="text-slate-600 leading-relaxed">Study alone or generate a unique class code to invite your friends. Learning is better when it's a team sport.</p>
                    <ul className="mt-6 space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-accent-600" /> 6-digit invite codes</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-accent-600" /> Shared test banks</li>
                    </ul>
                </div>

                <div className="glass-card rounded-3xl p-8 group glass-card-hover relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/20"></div>
                    <div className="bg-yellow-500/20 border border-yellow-500/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                        <Award className="w-7 h-7 text-yellow-600 border-yellow-400/50" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-yellow-300 transition-colors">Competitive Quizzes</h3>
                    <p className="text-slate-600 leading-relaxed">Test your knowledge with AI-crafted 20-question quizzes and fight for the #1 spot on the live leaderboard.</p>
                    <ul className="mt-6 space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-yellow-600" /> 15 MCQs + 5 Short answers</li>
                        <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-yellow-600" /> Real-time ranking</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
