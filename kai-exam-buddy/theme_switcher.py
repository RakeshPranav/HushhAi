import os
import re

def replace_theme_classes(content):
    # Safe regex replacements
    replacements = [
        (r'\bbg-slate-900\b', 'bg-slate-50'),
        (r'\bbg-slate-800\b', 'bg-white'),
        (r'\bbg-slate-950\b', 'bg-slate-100'),
        (r'\btext-white\b', 'text-slate-900'),
        (r'\btext-slate-400\b', 'text-slate-600'),
        (r'\btext-slate-300\b', 'text-slate-700'),
        (r'\btext-slate-500\b', 'text-slate-500'),
        (r'\bborder-slate-800\b', 'border-slate-200'),
        (r'\bborder-slate-700\b', 'border-slate-200'),
        (r'\bborder-slate-600\b', 'border-slate-300'),
        (r'\bhower:bg-slate-800\b', 'hover:bg-slate-100'),
        (r'\bhover:text-white\b', 'hover:text-slate-900'),
        (r'\bbg-white/5\b', 'bg-slate-900/5'),
        (r'\bbg-white/10\b', 'bg-slate-900/10'),
        (r'\bborder-white/10\b', 'border-slate-900/10'),
        (r'\bborder-white/5\b', 'border-slate-900/5'),
        (r'\btext-primary-300\b', 'text-primary-600'),
        (r'\btext-primary-400\b', 'text-primary-600'),
        (r'\btext-accent-400\b', 'text-accent-600'),
        (r'\btext-yellow-400\b', 'text-yellow-600'),
        (r'\bbg-primary-500/10\b', 'bg-primary-500/20'),
        (r'\bbg-accent-500/10\b', 'bg-accent-500/20'),
        (r'\bbg-yellow-500/10\b', 'bg-yellow-500/20'),
    ]

    for old, new in replacements:
        content = re.sub(old, new, content)
        
    return content

src_dir = r"e:\Hushh.Ai\kai-exam-buddy\frontend\src"

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Additional logic to fix hover:bg-white that resulted from bg-slate-800
            content = replace_theme_classes(content)
            content = content.replace("hover:bg-white", "hover:bg-slate-100")
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
                
print("Finished replacing theme classes in .jsx files")

# Update index.css individually
css_path = os.path.join(src_dir, 'index.css')
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Make body light
css = re.sub(r'background: linear-gradient\(135deg, \#0f172a 0%, \#020617 100%\);', '', css)
css = re.sub(r'background-color: \#020617;', 'background-color: #f8fafc;', css)
css = re.sub(r'color: \#f1f5f9;', 'color: #0f172a;', css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Finished updating index.css")
