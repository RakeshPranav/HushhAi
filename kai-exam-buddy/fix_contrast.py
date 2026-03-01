import os
import re

def replace_specifics(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"e:\Hushh.Ai\kai-exam-buddy\frontend\src\pages"

# Fix Landing Page Hero Text Gradients
landing_replacements = [
    ('bg-gradient-to-r from-primary-400 via-indigo-400 to-accent-400', 'bg-linear-to-r from-primary-600 via-indigo-600 to-accent-600'),
    ('from-primary-400 to-accent-400', 'from-primary-600 to-accent-600')
]
replace_specifics(os.path.join(base_dir, 'LandingPage.jsx'), landing_replacements)

# Fix Upload Page Button Text Gradient
upload_replacements = [
    ('from-primary-400 to-accent-400', 'from-primary-600 to-accent-600')
]
replace_specifics(os.path.join(base_dir, 'UploadPage.jsx'), upload_replacements)

# Fix Quiz Option Cards Border and Background
quiz_replacements = [
    ('bg-white/30', 'bg-slate-50'),
    ('border-slate-900/10 bg-white/30 hover:bg-slate-100/80 hover:border-white/20', 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'),
    ('text-slate-700 font-bold mb-4', 'text-slate-900 font-bold mb-4'), # Short Answer Headers
]
replace_specifics(os.path.join(base_dir, 'QuizPage.jsx'), quiz_replacements)

print("Targeted contrast fixes applied.")
