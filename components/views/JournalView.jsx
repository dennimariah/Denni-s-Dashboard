'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cls } from '@/lib/helpers';
import { CardHead, Pill, burstConfetti } from '@/components/ui/primitives';
import Icon from '@/components/ui/Icon';

// ── Constants ─────────────────────────────────────────────────────────────────

const TAGS = [
  { id: 'work',      label: 'Work Life',        color: '#7aaee5', bg: '#dceaf7' },
  { id: 'family',    label: 'Family',            color: '#88b896', bg: '#d8ecdc' },
  { id: 'friends',   label: 'Friends',           color: '#b39bd8', bg: '#ebe1f5' },
  { id: 'love',      label: 'Romantic',          color: '#e8527a', bg: '#fbd7e1' },
  { id: 'selfcare',  label: 'Self-Care',         color: '#f4a261', bg: '#fde3cf' },
  { id: 'growth',    label: 'Personal Growth',   color: '#f7c548', bg: '#fef3cd' },
  { id: 'mental',    label: 'Mental Health',     color: '#d68d84', bg: '#f8dad5' },
  { id: 'gratitude', label: 'Gratitude',         color: '#6db88a', bg: '#c8e8d4' },
  { id: 'goals',     label: 'Goals & Dreams',    color: '#9b7cc8', bg: '#e0d4f5' },
  { id: 'body',      label: 'Body & Fitness',    color: '#e07b54', bg: '#f9dfd5' },
];

const TAG_MAP = Object.fromEntries(TAGS.map(t => [t.id, t]));

const MOOD_LEVELS = [
  { level: 1, label: 'Struggling',  color: '#7c6b9e', bg: '#ded5f0', emoji: '😔' },
  { level: 2, label: 'Low',         color: '#7a9ac2', bg: '#d5e4f2', emoji: '😕' },
  { level: 3, label: 'Okay',        color: '#7aaa88', bg: '#d5ecda', emoji: '😐' },
  { level: 4, label: 'Good',        color: '#e09a5a', bg: '#f9e5cf', emoji: '🙂' },
  { level: 5, label: 'Glowing',     color: '#e8527a', bg: '#fbd7e1', emoji: '✨' },
];

const TEMPLATES = [
  {
    id: 'daily',
    label: 'Daily Check-In',
    icon: '📅',
    title: 'Daily Check-In — ',
    body: `How I'm feeling today (mind + body):\n\n\nWhat happened today:\n\n\nWhat I'm grateful for:\n\n\nWhat I want to release:\n\n\nIntention for tomorrow:\n`,
  },
  {
    id: 'weekly',
    label: 'Weekly Reflection',
    icon: '🗓',
    title: 'Weekly Reflection — ',
    body: `Wins this week (big and small):\n\n\nWhat challenged me:\n\n\nWhat I learned about myself:\n\n\nHow I showed up for myself:\n\n\nWhat I'm carrying into next week:\n`,
  },
  {
    id: 'processing',
    label: 'Processing Emotions',
    icon: '🌊',
    title: 'Processing — ',
    body: `What I'm feeling:\n\n\nWhere I feel it in my body:\n\n\nWhat triggered this:\n\n\nWhat this feeling is trying to tell me:\n\n\nWhat I need right now:\n`,
  },
  {
    id: 'gratitude',
    label: 'Gratitude Log',
    icon: '🌸',
    title: 'Gratitude — ',
    body: `3 things I'm deeply grateful for today:\n1. \n2. \n3. \n\nSomething I take for granted that I want to appreciate more:\n\n\nSomeone who showed up for me recently:\n\n\nA small moment that made me smile:\n`,
  },
  {
    id: 'letter',
    label: 'Letter to Future Self',
    icon: '💌',
    title: 'Dear Future Me — ',
    body: `Dear future me,\n\nRight now I am...\n\n\nI want you to remember...\n\n\nI'm working toward...\n\n\nI hope you know that...\n\n\nWith love,\nPast me`,
  },
  {
    id: 'goals',
    label: 'Goal Setting',
    icon: '🎯',
    title: 'Goal Setting — ',
    body: `What I want to accomplish:\n\n\nWhy this matters to me:\n\n\nWhat success looks like:\n\n\nFirst 3 steps I can take:\n1. \n2. \n3. \n\nWhat might get in my way:\n\n\nHow I'll handle setbacks:\n`,
  },
];

const PROMPTS = {
  'Dating & Romance': [
    "What do I actually want in a partner — not what I think I should want?",
    "How has my idea of love changed in the last year?",
    "Describe your ideal Sunday morning with the right person.",
    "What patterns show up in my romantic relationships that I want to change?",
    "What does it feel like when I'm truly seen by someone?",
    "Write about a time you chose yourself over a relationship. Was it the right call?",
    "What does emotional availability mean to me, and do I offer it?",
    "What would I say to myself after my last heartbreak?",
    "What am I no longer willing to settle for?",
    "How do I handle conflict in relationships? How do I want to handle it?",
  ],
  'Friendships': [
    "Which friendships are filling me up right now, and which are draining me?",
    "Write about a friend who has shaped who you are.",
    "When did you last show up fully for someone who needed you?",
    "Is there a friendship I need to let go of? What's holding me back?",
    "What kind of friend am I? What kind of friend do I want to be?",
    "Write about a time a friendship surprised you — good or bad.",
    "Who do I call when everything falls apart? Have I told them what they mean to me?",
    "How do I feel about my social life right now? What would I change?",
    "Write about growing apart from someone you were once close to.",
    "What do I bring to my friendships that's uniquely me?",
  ],
  'Career & Ambition': [
    "What does success actually look like for me — not for my parents or LinkedIn?",
    "What work makes me lose track of time?",
    "Write about a time you were overlooked at work. How did you handle it?",
    "What would you do if you knew you couldn't fail?",
    "How do race and gender show up in your professional life?",
    "What's the difference between the career I have and the career I want?",
    "What am I most proud of professionally?",
    "What would I tell my 22-year-old self about work?",
    "Write about a professional boundary you need to set.",
    "Money and meaning — can you have both? Where are you at with that tension?",
    "What does rest as resistance mean to you in the context of hustle culture?",
  ],
  'Family': [
    "What patterns from my family do I want to keep? Which ones end with me?",
    "Write a letter to a family member you've never fully said what you need to say to.",
    "How has your upbringing shaped how you love?",
    "What does 'home' mean to you right now?",
    "Write about a family memory that still lives in your body.",
    "How do you set — or struggle to set — boundaries with family?",
    "What would healing look like in my family?",
    "Write about the women in your family and what they passed down to you.",
    "What do you wish your family understood about you?",
    "How do you carry the people who raised you with you every day?",
  ],
  'Identity & Self': [
    "What does being a Black woman in 2026 mean to you, personally?",
    "Write about a time you shrunk yourself to make someone comfortable.",
    "What parts of your identity feel most alive right now?",
    "How has your relationship with your body changed over the years?",
    "What story have you been telling about yourself that might not be true anymore?",
    "Write about a moment you felt completely, unapologetically yourself.",
    "What does softness mean to you? Is it something you allow yourself?",
    "How do you navigate spaces where you're the only one who looks like you?",
    "What beauty standards have you let go of? Which ones are still holding on?",
    "Write about your name — the one you were given, and the one you're building.",
  ],
  'Healing & Therapy': [
    "What am I still carrying that I need to put down?",
    "Write about your inner child — what did she need that she didn't get?",
    "What does my nervous system feel like most days?",
    "Write about a wound that has mostly healed. What helped?",
    "What does my anxiety sound like? Write out what it says.",
    "Who taught you that you had to earn love? How has that shown up?",
    "What am I afraid to say out loud, even to myself?",
    "Write a compassionate letter to the version of you that was struggling hardest.",
    "What coping mechanisms have I outgrown?",
    "What does my therapist keep asking me that I avoid answering?",
    "Where in your life do you keep replaying the same loop?",
  ],
  'Body & Wellness': [
    "How am I actually doing — body, not just aesthetics?",
    "What does rest mean to me? Am I getting enough of it?",
    "Write about your relationship with food right now, honestly.",
    "What does my body do for me that I don't thank it for?",
    "Write about a wellness practice that has genuinely changed your life.",
    "What does my body tell me when I'm stressed that I usually ignore?",
    "How has your relationship with your hair/skin/body changed this year?",
    "What does it feel like to be in your body on a good day?",
    "Write about a physical accomplishment you're proud of.",
    "What does 'taking care of yourself' actually mean to you, beyond the aesthetics?",
  ],
  'Dreams & Vision': [
    "Describe your life 5 years from now in vivid, unapologetic detail.",
    "What dream have you been too afraid to say out loud?",
    "What would you do with one free year and no financial pressure?",
    "Write about the life you were told you should want vs. the one you actually want.",
    "What does abundance mean to you? Do you believe it's available to you?",
    "If your life were a movie, what genre would it be right now? What genre do you want?",
    "What legacy do you want to leave?",
    "Write a scene from a day in your dream life.",
    "What small step toward a big dream can you take this week?",
    "What does it feel like to want something so much it scares you?",
  ],
  'Everyday Life': [
    "What was the best 10 minutes of today?",
    "Describe exactly where you are right now — the light, the sounds, how you feel.",
    "What's something ordinary that you've been appreciating lately?",
    "Write about a recent conversation that stuck with you.",
    "What made you laugh this week?",
    "What are you looking forward to, big or small?",
    "Write about something you noticed today that you usually walk past.",
    "What's the vibe of this season of your life?",
    "What song is on repeat and why?",
    "If today were a color, what would it be and why?",
  ],
  'General': [
    "What's taking up the most space in your head right now?",
    "Three things you want to remember about this exact moment in your life.",
    "What has surprised you about yourself lately?",
    "Write about something you changed your mind about.",
    "What are you curious about right now?",
    "What do you need more of? Less of?",
    "Write about something you're proud of that nobody else knows about.",
    "What would you say to yourself right now if you were your own best friend?",
    "What question are you sitting with that you don't have an answer to yet?",
    "What does joy feel like in your body?",
  ],
};

const EMOJI_SETS = {
  'Feelings': ['😊','😌','🥰','😂','😭','😢','😤','😮','😩','🥲','😔','😒','🤔','😳','🥺','😍','🤩','😏','😞','😠'],
  'Nature': ['🌸','🌷','🌹','🌿','🍃','🌙','⭐','✨','🌈','☀️','🌊','🔥','🌺','🦋','🌻','🍂','❄️','🌼','🌱','🍀'],
  'Vibes': ['💫','💕','💖','💗','💓','💞','💝','❤️','🖤','💜','💙','💚','🧡','💛','❤️‍🔥','💔','🫶','✌️','🙏','👑'],
  'Objects': ['📖','✏️','☕','🎵','🎧','💻','📱','🛁','🕯️','🧘','💊','🍷','🧴','🎨','📷','🌙','⌚','💌','🎀','🪞'],
};

const GUIDED_QUESTIONS = [
  { id: 'mood', question: 'How are you feeling right now?', options: ['Really good ✨', 'Pretty okay 🙂', 'Meh / neutral 😐', 'A little low 😕', 'Struggling 😔'] },
  { id: 'focus', question: "What's most on your mind?", options: ['My relationships', 'Work / career', 'My goals & dreams', 'My mental health', 'My body / health', 'Just everyday life'] },
  { id: 'type', question: 'What kind of writing do you need?', options: ['To process something heavy', 'To dream and vision', 'To express gratitude', 'To vent and release', 'To reflect and grow'] },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 1200;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// ── Lock Screen ───────────────────────────────────────────────────────────────

function LockScreen({ pin, onUnlock, onSetPin }) {
  const [input, setInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [setting, setSetting] = useState(!pin);

  const handleDigit = (d) => {
    if (setting) {
      if (newPin.length < 4) {
        const next = newPin + d;
        setNewPin(next);
        if (next.length === 4 && !confirmPin) { }
      } else if (confirmPin.length < 4) {
        const next = confirmPin + d;
        setConfirmPin(next);
        if (next.length === 4) {
          if (next === newPin) { onSetPin(newPin); }
          else { setError('PINs don\'t match — try again'); setConfirmPin(''); setNewPin(''); }
        }
      }
    } else {
      if (input.length < 4) {
        const next = input + d;
        setInput(next);
        if (next.length === 4) {
          if (next === pin) { onUnlock(); }
          else { setError('Incorrect PIN'); setTimeout(() => { setInput(''); setError(''); }, 600); }
        }
      }
    }
  };

  const handleBack = () => {
    setError('');
    if (setting) {
      if (newPin.length < 4) setNewPin(p => p.slice(0, -1));
      else setConfirmPin(p => p.slice(0, -1));
    } else {
      setInput(p => p.slice(0, -1));
    }
  };

  const displayVal = setting ? (newPin.length < 4 ? newPin : confirmPin) : input;
  const prompt = setting
    ? newPin.length < 4 ? 'Choose a 4-digit PIN' : 'Confirm your PIN'
    : 'Enter PIN to unlock';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 28 }}>
      <div style={{ fontSize: 32 }}>🔐</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: 'var(--ink)' }}>Your journal is private</div>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: -16 }}>{prompt}</div>
      <div style={{ display: 'flex', gap: 14 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: i < displayVal.length ? 'var(--primary)' : 'var(--line)', transition: 'background 0.15s' }} />
        ))}
      </div>
      {error && <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d, i) => (
          <button key={i} onClick={() => d === '⌫' ? handleBack() : d !== '' && handleDigit(String(d))} style={{
            width: 68, height: 68, borderRadius: 18, border: '1px solid var(--line)', background: d === '⌫' ? 'transparent' : 'var(--card)',
            fontSize: d === '⌫' ? 20 : 22, fontFamily: 'var(--font-serif)', fontWeight: 500, color: 'var(--ink)',
            cursor: d === '' ? 'default' : 'pointer', transition: 'background 0.1s',
          }} disabled={d === ''}>{d}</button>
        ))}
      </div>
    </div>
  );
}

// ── Emoji Picker ──────────────────────────────────────────────────────────────

function EmojiPicker({ onSelect, onClose }) {
  const [cat, setCat] = useState('Feelings');
  return (
    <div style={{ position: 'absolute', zIndex: 50, bottom: '100%', right: 0, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', width: 280 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto' }}>
        {Object.keys(EMOJI_SETS).map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ padding: '4px 10px', borderRadius: 8, border: 'none', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', background: cat === c ? 'var(--primary)' : 'var(--bg)', color: cat === c ? 'white' : 'var(--muted)', fontFamily: 'inherit' }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
        {EMOJI_SETS[cat].map((em, i) => (
          <button key={i} onClick={() => { onSelect(em); onClose(); }} style={{ fontSize: 20, padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }} title={em}>{em}</button>
        ))}
      </div>
    </div>
  );
}

// ── Prompt Randomizer ─────────────────────────────────────────────────────────

function PromptRandomizer({ onSelect, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const pick = (questionId, answer) => {
    const next = { ...answers, [questionId]: answer };
    setAnswers(next);
    if (step < GUIDED_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Select prompt based on answers
      const moodAnswer = next.mood || '';
      const focusAnswer = next.focus || '';
      let categoryKey = 'General';
      if (focusAnswer.includes('relationship')) categoryKey = 'Dating & Romance';
      else if (focusAnswer.includes('Work')) categoryKey = 'Career & Ambition';
      else if (focusAnswer.includes('goals')) categoryKey = 'Dreams & Vision';
      else if (focusAnswer.includes('mental')) categoryKey = 'Healing & Therapy';
      else if (focusAnswer.includes('body')) categoryKey = 'Body & Wellness';
      else if (focusAnswer.includes('everyday')) categoryKey = 'Everyday Life';
      const pool = PROMPTS[categoryKey] || PROMPTS['General'];
      onSelect(pool[Math.floor(Math.random() * pool.length)]);
      onClose();
    }
  };

  const q = GUIDED_QUESTIONS[step];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: 28, maxWidth: 400, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 12 }}>Prompt Finder · {step + 1}/{GUIDED_QUESTIONS.length}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, marginBottom: 20, color: 'var(--ink)', lineHeight: 1.4 }}>{q.question}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.options.map(opt => (
            <button key={opt} onClick={() => pick(q.id, opt)} style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--line)', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 14, textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.15s' }}>{opt}</button>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: 16, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Entry Modal (full expand) ─────────────────────────────────────────────────

function EntryModal({ entry, onClose, onDelete }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }} onClick={onClose}>
      <div style={{ background: 'var(--card)', borderRadius: 20, padding: 32, maxWidth: 600, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--line)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>×</button>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20 }}>{entry.mood}</span>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{entry.date}</span>
          {entry.location && <span style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {entry.location}</span>}
          {(entry.tags || []).map(t => {
            const tag = TAG_MAP[t];
            return tag ? <span key={t} style={{ padding: '2px 8px', borderRadius: 6, background: tag.bg, color: tag.color, fontSize: 11, fontWeight: 600 }}>{tag.label}</span> : null;
          })}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: 'var(--ink)', marginBottom: 16, lineHeight: 1.3 }}>{entry.title}</h2>
        <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 20 }}>{entry.body}</div>
        {entry.photos && entry.photos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 20 }}>
            {entry.photos.map((p, i) => <img key={i} src={p} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 10 }} />)}
          </div>
        )}
        {entry.habitCheckins && Object.keys(entry.habitCheckins).length > 0 && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
            Habits completed: {Object.entries(entry.habitCheckins).filter(([,v]) => v).map(([k]) => k).join(', ')}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          <button onClick={() => { exportPDF(entry); }} style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>⬇ Export PDF</button>
          <button onClick={() => { onDelete(entry.id); onClose(); }} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Delete entry</button>
        </div>
      </div>
    </div>
  );
}

const exportPDF = (entry) => {
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>${entry.title || 'Journal Entry'}</title><style>
    body { font-family: Georgia, serif; max-width: 600px; margin: 40px auto; color: #1a1a1a; line-height: 1.7; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
    pre { font-family: Georgia, serif; font-size: 15px; white-space: pre-wrap; }
  </style></head><body>
    <h1>${entry.title || 'Journal Entry'}</h1>
    <div class="meta">${entry.mood || ''} ${entry.date} ${entry.location ? '· 📍 ' + entry.location : ''}</div>
    <pre>${entry.body || ''}</pre>
  </body></html>`);
  w.document.close();
  w.print();
};

// ── Entry Editor ──────────────────────────────────────────────────────────────

function EntryEditor({ habits, onSave, prefillPrompt, onClearPrompt }) {
  const today = todayKey();
  const blank = { title: '', body: '', mood: '✨', tags: [], location: '', photos: [], habitCheckins: {}, isPrivate: false };
  const [draft, setDraft] = useState(blank);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showRandomizer, setShowRandomizer] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [listening, setListening] = useState(false);
  const bodyRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (prefillPrompt) {
      setDraft(d => ({ ...d, title: prefillPrompt }));
      onClearPrompt?.();
    }
  }, [prefillPrompt]);

  const setField = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const insertEmoji = (em) => {
    const el = bodyRef.current;
    if (!el) { setField('body', draft.body + em); return; }
    const start = el.selectionStart, end = el.selectionEnd;
    const next = draft.body.slice(0, start) + em + draft.body.slice(end);
    setField('body', next);
    setTimeout(() => el.setSelectionRange(start + em.length, start + em.length), 0);
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const urls = await Promise.all(files.map(compressImage));
    setField('photos', [...draft.photos, ...urls]);
    e.target.value = '';
  };

  const removePhoto = (i) => setField('photos', draft.photos.filter((_, idx) => idx !== i));

  const toggleTag = (tagId) => {
    const next = draft.tags.includes(tagId) ? draft.tags.filter(t => t !== tagId) : [...draft.tags, tagId];
    setField('tags', next);
  };

  const autotag = () => {
    const text = (draft.title + ' ' + draft.body).toLowerCase();
    const keywords = {
      work:      ['work', 'job', 'boss', 'office', 'career', 'meeting', 'coworker', 'client', 'salary', 'promotion', 'deadline', 'manager', 'corporate', 'interview'],
      family:    ['family', 'mom', 'dad', 'sister', 'brother', 'parent', 'grandma', 'grandpa', 'aunt', 'uncle', 'cousin', 'childhood', 'home'],
      friends:   ['friend', 'bestie', 'girls', 'squad', 'hangout', 'brunch', 'friendship', 'besties', 'homegirl', 'group chat'],
      love:      ['date', 'dating', 'boyfriend', 'girlfriend', 'relationship', 'crush', 'romance', 'heartbreak', 'situationship', 'talking to', 'ex ', 'love interest', 'boo'],
      selfcare:  ['skincare', 'nails', 'spa', 'bath', 'relax', 'self-care', 'self care', 'massage', 'routine', 'rest day', 'pampering'],
      growth:    ['growth', 'therapy', 'improve', 'mindset', 'reflect', 'lesson', 'learning', 'better myself', 'habit', 'discipline', 'accountability'],
      mental:    ['anxiety', 'stress', 'overwhelm', 'depression', 'mental health', 'sad', 'crying', 'struggle', 'breakdown', 'spiral', 'overthinking', 'exhausted'],
      gratitude: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude', 'thankful', 'abundance'],
      goals:     ['goal', 'dream', 'vision', 'plan', 'future', 'ambition', 'aspire', 'manifest', 'intention'],
      body:      ['gym', 'workout', 'fitness', 'exercise', 'running', 'walking', 'eating', 'body', 'weight', 'health', 'nutrition', 'hair', 'skin'],
    };
    const matched = Object.entries(keywords)
      .filter(([, words]) => words.some(w => text.includes(w)))
      .map(([tag]) => tag);
    if (matched.length) setField('tags', [...new Set([...draft.tags, ...matched])]);
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input is not supported in this browser'); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).slice(e.resultIndex).map(r => r[0].transcript).join(' ');
      setField('body', draft.body + (draft.body ? ' ' : '') + transcript);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  const applyTemplate = (tpl) => {
    const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setDraft(d => ({ ...d, title: tpl.title + now, body: tpl.body }));
    setShowTemplates(false);
  };

  const save = async () => {
    if (!draft.title.trim() && !draft.body.trim()) return;
    const now = new Date();
    const entry = {
      id: 'j' + Date.now(),
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      dateKey: todayKey(),
      ...draft,
    };
    onSave(entry);
    setDraft(blank);
  };

  const wordCount = draft.body.split(/\s+/).filter(Boolean).length;
  const MOOD_EMOJIS = ['😔','😕','😐','🙂','✨'];

  return (
    <div style={{ background: 'var(--card)', borderRadius: 18, border: '1px solid var(--line)', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: 8 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowTemplates(!showTemplates)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>📋 Template</button>
        <button onClick={() => setShowRandomizer(true)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>🎲 Prompt</button>
        <button onClick={toggleVoice} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: `1px solid ${listening ? 'var(--primary)' : 'var(--line)'}`, background: listening ? 'var(--primary)' : 'var(--card)', color: listening ? 'white' : 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>{listening ? '🔴 Stop' : '🎙 Voice'}</button>
      </div>

      {/* Template picker */}
      {showTemplates && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', background: 'var(--bg)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TEMPLATES.map(tpl => (
            <button key={tpl.id} onClick={() => applyTemplate(tpl)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--card)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}>{tpl.icon} {tpl.label}</button>
          ))}
          <button onClick={() => setShowTemplates(false)} style={{ marginLeft: 'auto', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>Done</button>
        </div>
      )}

      <div style={{ padding: 20 }}>
        {/* Mood + title row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {MOOD_EMOJIS.map(em => (
              <button key={em} onClick={() => setField('mood', em)} style={{ fontSize: 18, padding: '3px 5px', borderRadius: 8, border: `1.5px solid ${draft.mood === em ? 'var(--primary)' : 'transparent'}`, background: draft.mood === em ? 'var(--bg)' : 'transparent', cursor: 'pointer' }}>{em}</button>
            ))}
          </div>
          <input
            placeholder="Give this entry a title..."
            value={draft.title}
            onChange={e => setField('title', e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--ink)', background: 'transparent', padding: '4px 0' }}
          />
          <button onClick={() => setField('isPrivate', !draft.isPrivate)} style={{ fontSize: 16, padding: 4, background: 'none', border: 'none', cursor: 'pointer', opacity: draft.isPrivate ? 1 : 0.4 }} title={draft.isPrivate ? 'Private' : 'Public'}>🔒</button>
        </div>

        {/* Location */}
        <input
          placeholder="📍 Add location (optional)..."
          value={draft.location}
          onChange={e => setField('location', e.target.value)}
          style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--line)', outline: 'none', fontSize: 13, color: 'var(--muted)', background: 'transparent', padding: '6px 0', marginBottom: 14, fontFamily: 'inherit', boxSizing: 'border-box' }}
        />

        {/* Body */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={bodyRef}
            placeholder="What's on your mind? Pour it all out here..."
            value={draft.body}
            onChange={e => setField('body', e.target.value)}
            rows={8}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, fontFamily: 'var(--font-serif)', color: 'var(--ink)', background: 'transparent', resize: 'vertical', lineHeight: 1.75, boxSizing: 'border-box', padding: '0 0 8px' }}
          />
          {showEmoji && <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />}
        </div>

        {/* Photos strip */}
        {draft.photos.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, marginBottom: 10 }}>
            {draft.photos.map((p, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={p} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
                <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div style={{ marginTop: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 4 }}>Tags</span>
            {TAGS.map(tag => (
              <button key={tag.id} onClick={() => toggleTag(tag.id)} style={{
                padding: '3px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', border: `1.5px solid ${draft.tags.includes(tag.id) ? tag.color : 'var(--line)'}`,
                background: draft.tags.includes(tag.id) ? tag.bg : 'transparent', color: draft.tags.includes(tag.id) ? tag.color : 'var(--muted)', fontFamily: 'inherit', transition: 'all 0.15s', fontWeight: draft.tags.includes(tag.id) ? 600 : 400,
              }}>{tag.label}</button>
            ))}
            <button onClick={autotag} style={{ padding: '3px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', border: '1.5px dashed var(--primary)', background: 'transparent', color: 'var(--primary)', fontFamily: 'inherit' }}>
              ✦ Auto-tag
            </button>
          </div>
        </div>

        {/* Habits */}
        {habits && habits.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <button onClick={() => setShowHabits(!showHabits)} style={{ fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
              {showHabits ? '▾' : '▸'} Habits completed today
            </button>
            {showHabits && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {habits.map(h => {
                  const done = !!draft.habitCheckins[h.id];
                  return (
                    <button key={h.id} onClick={() => setField('habitCheckins', { ...draft.habitCheckins, [h.id]: !done })} style={{
                      padding: '4px 10px', borderRadius: 8, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${done ? h.color : 'var(--line)'}`,
                      background: done ? h.bg : 'transparent', color: done ? h.color : 'var(--muted)', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>{h.icon} {h.label}</button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', flex: 1 }}>{wordCount} words</div>
          <label style={{ cursor: 'pointer' }}>
            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotoUpload} />
            <span style={{ fontSize: 18, opacity: 0.6, cursor: 'pointer' }} title="Add photos">📷</span>
          </label>
          <button onClick={() => setShowEmoji(!showEmoji)} style={{ fontSize: 18, padding: 4, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }} title="Emoji">😊</button>
          <button onClick={save} className="btn btn--pink" style={{ fontSize: 13 }}>Save entry</button>
        </div>
      </div>

      {showRandomizer && <PromptRandomizer onSelect={p => setDraft(d => ({ ...d, title: p }))} onClose={() => setShowRandomizer(false)} />}
    </div>
  );
}

// ── Entries Tab ───────────────────────────────────────────────────────────────

function EntriesTab({ state, setState, prefillPrompt = '', onClearPrompt }) {
  const journal = state.journal || [];
  const habits = state.habits || [];
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState(null);
  const [expandedEntry, setExpandedEntry] = useState(null);

  const filtered = journal.filter(e => {
    const matchTag = !filterTag || (e.tags || []).includes(filterTag);
    const q = search.toLowerCase();
    const matchSearch = !q || (e.title || '').toLowerCase().includes(q) || (e.body || '').toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  const save = (entry) => setState(s => ({ ...s, journal: [entry, ...s.journal] }));
  const remove = (id) => setState(s => ({ ...s, journal: s.journal.filter(j => j.id !== id) }));

  return (
    <div>
      <EntryEditor habits={habits} onSave={save} prefillPrompt={prefillPrompt} onClearPrompt={onClearPrompt} />

      {/* Search + filter */}
      <div style={{ margin: '20px 0 14px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <input
            placeholder="Search entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--card)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box' }}
          />
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--muted)' }}>🔍</span>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <button onClick={() => setFilterTag(null)} style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid var(--line)', background: !filterTag ? 'var(--primary)' : 'var(--card)', color: !filterTag ? 'white' : 'var(--muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>All</button>
          {TAGS.map(tag => (
            <button key={tag.id} onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)} style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
              border: `1px solid ${filterTag === tag.id ? tag.color : 'var(--line)'}`,
              background: filterTag === tag.id ? tag.bg : 'var(--card)',
              color: filterTag === tag.id ? tag.color : 'var(--muted)', fontFamily: 'inherit', fontWeight: filterTag === tag.id ? 600 : 400,
            }}>{tag.label}</button>
          ))}
        </div>
      </div>

      {/* Entry list */}
      {filtered.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
          {search || filterTag ? 'No entries match your search' : 'Write your first entry above'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(e => {
            const preview = (e.body || '').split('\n').filter(Boolean).slice(0, 2).join(' ');
            return (
              <div key={e.id} style={{ background: 'var(--card)', borderRadius: 14, border: '1px solid var(--line)', padding: '16px 18px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16 }}>{e.mood}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{e.date}</span>
                  {e.location && <span style={{ fontSize: 11, color: 'var(--muted)' }}>📍 {e.location}</span>}
                  {e.isPrivate && <span style={{ fontSize: 11 }}>🔒</span>}
                  {(e.tags || []).map(t => {
                    const tag = TAG_MAP[t];
                    return tag ? <span key={t} style={{ padding: '1px 7px', borderRadius: 6, background: tag.bg, color: tag.color, fontSize: 10, fontWeight: 600 }}>{tag.label}</span> : null;
                  })}
                  {e.photos?.length > 0 && <span style={{ fontSize: 11, color: 'var(--muted)' }}>📷 {e.photos.length}</span>}
                </div>
                {e.title && <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{e.title}</div>}
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{preview}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                  <button onClick={() => exportPDF(e)} style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>⬇ PDF</button>
                  <button onClick={() => setExpandedEntry(e)} style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Read more ↗</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expandedEntry && <EntryModal entry={expandedEntry} onClose={() => setExpandedEntry(null)} onDelete={id => { remove(id); setExpandedEntry(null); }} />}
    </div>
  );
}

// ── Mood Tab ──────────────────────────────────────────────────────────────────

function MoodTab({ state, setState }) {
  const moodLog = state.moodLog || {};
  const today = todayKey();
  const [viewDate, setViewDate] = useState(new Date());
  const [logNote, setLogNote] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayEntry = moodLog[today];

  const logMood = () => {
    if (!selectedLevel) return;
    setState(s => ({ ...s, moodLog: { ...s.moodLog, [today]: { level: selectedLevel, note: logNote } } }));
    setLogNote('');
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const avgLevel = (() => {
    const vals = Object.entries(moodLog).filter(([k]) => k.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).map(([, v]) => v.level);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  })();

  return (
    <div className="bento">
      {/* Log today */}
      <div className="card col-5" style={{ padding: 20 }}>
        <CardHead title="Log today's mood" sub={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} />
        {todayEntry ? (
          <div style={{ marginBottom: 20, padding: 14, background: 'var(--bg)', borderRadius: 12, border: `2px solid ${MOOD_LEVELS[todayEntry.level - 1]?.color}` }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{MOOD_LEVELS[todayEntry.level - 1]?.emoji}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{MOOD_LEVELS[todayEntry.level - 1]?.label}</div>
            {todayEntry.note && <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>{todayEntry.note}</div>}
            <button onClick={() => setState(s => { const l = { ...s.moodLog }; delete l[today]; return { ...s, moodLog: l }; })} style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Update</button>
          </div>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {MOOD_LEVELS.map(ml => (
            <button key={ml.level} onClick={() => setSelectedLevel(ml.level)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12,
              border: `1.5px solid ${selectedLevel === ml.level ? ml.color : 'var(--line)'}`,
              background: selectedLevel === ml.level ? ml.bg : 'var(--bg)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 22 }}>{ml.emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: selectedLevel === ml.level ? ml.color : 'var(--ink)' }}>{ml.label}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 14, height: 14, borderRadius: '50%', background: ml.color, opacity: selectedLevel === ml.level ? 1 : 0.25 }} />
            </button>
          ))}
        </div>
        <textarea placeholder="Add a note (optional)..." value={logNote} onChange={e => setLogNote(e.target.value)} rows={2}
          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, resize: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
        <button onClick={logMood} disabled={!selectedLevel} className="btn btn--pink" style={{ width: '100%', justifyContent: 'center' }}>Log mood</button>

        {/* Color key */}
        <div style={{ marginTop: 20, padding: 14, background: 'var(--bg)', borderRadius: 12 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Color key</div>
          {MOOD_LEVELS.map(ml => (
            <div key={ml.level} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: ml.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{ml.emoji} {ml.label}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' }}>Empty = no entry logged</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card col-7" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted)' }}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500 }}>{monthName}</div>
            {avgLevel && <div style={{ fontSize: 12, color: 'var(--muted)' }}>avg mood: {avgLevel}/5</div>}
          </div>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted)' }}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const entry = moodLog[key];
            const ml = entry ? MOOD_LEVELS[entry.level - 1] : null;
            const isToday = key === today;
            return (
              <div key={i} title={entry ? `${ml?.label}${entry.note ? ': ' + entry.note : ''}` : ''} style={{
                aspectRatio: '1', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                background: ml ? ml.bg : 'var(--bg)',
                border: isToday ? '2px solid var(--primary)' : `1px solid ${ml ? ml.color + '40' : 'var(--line)'}`,
                cursor: entry ? 'pointer' : 'default', position: 'relative',
              }}>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: ml ? ml.color : 'var(--muted)', fontWeight: isToday ? 700 : 400 }}>{d}</span>
                {ml && <span style={{ fontSize: 11 }}>{ml.emoji}</span>}
              </div>
            );
          })}
        </div>

        {/* Streak / stats */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Logged', val: Object.keys(moodLog).length },
            { label: 'This month', val: Object.keys(moodLog).filter(k => k.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length },
            { label: 'Avg / 5', val: avgLevel || '—' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: 'var(--ink)' }}>{stat.val}</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Prompts Tab ───────────────────────────────────────────────────────────────

function PromptsTab({ onUsePrompt }) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(PROMPTS)[0]);
  const [showRandomizer, setShowRandomizer] = useState(false);
  const categories = Object.keys(PROMPTS);

  const categoryIcons = {
    'Dating & Romance': '💕', 'Friendships': '🌿', 'Career & Ambition': '💼',
    'Family': '🏡', 'Identity & Self': '🌸', 'Healing & Therapy': '🌊',
    'Body & Wellness': '🌻', 'Dreams & Vision': '⭐', 'Everyday Life': '☀️', 'General': '✏️',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{Object.values(PROMPTS).flat().length} prompts across {categories.length} categories</div>
        <button onClick={() => setShowRandomizer(true)} className="btn btn--pink" style={{ fontSize: 12 }}>🎲 Surprise me</button>
      </div>
      <div style={{ display: 'flex', gap: 28 }}>
        {/* Category nav */}
        <div style={{ width: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10,
              border: 'none', background: activeCategory === cat ? 'var(--primary)' : 'transparent',
              color: activeCategory === cat ? 'white' : 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, textAlign: 'left', fontWeight: activeCategory === cat ? 600 : 400,
            }}>
              <span>{categoryIcons[cat] || '✦'}</span>
              <span style={{ lineHeight: 1.3 }}>{cat}</span>
            </button>
          ))}
        </div>
        {/* Prompts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>{categoryIcons[activeCategory]} {activeCategory}</div>
          {PROMPTS[activeCategory].map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12 }}>
              <span style={{ color: 'var(--accent-3)', fontSize: 14, marginTop: 1, flexShrink: 0 }}>›</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{p}</span>
              <button onClick={() => onUsePrompt(p)} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}>Use →</button>
            </div>
          ))}
        </div>
      </div>
      {showRandomizer && <PromptRandomizer onSelect={p => { onUsePrompt(p); }} onClose={() => setShowRandomizer(false)} />}
    </div>
  );
}

// ── Brain Dump Tab ────────────────────────────────────────────────────────────

function BrainDumpTab({ state, setState }) {
  const dumps = state.brainDumps || [];
  const [text, setText] = useState('');
  const listening = useRef(false);
  const recRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const save = () => {
    if (!text.trim()) return;
    setState(s => ({ ...s, brainDumps: [{ id: 'bd' + Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), dateKey: todayKey(), text }, ...(s.brainDumps || [])] }));
    setText('');
  };

  const remove = (id) => setState(s => ({ ...s, brainDumps: (s.brainDumps || []).filter(d => d.id !== id) }));

  const toggleVoice = () => {
    if (isListening) { recRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser'); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.onresult = (e) => {
      const t = Array.from(e.results).slice(e.resultIndex).map(r => r[0].transcript).join(' ');
      setText(prev => prev + (prev ? ' ' : '') + t);
    };
    rec.onend = () => setIsListening(false);
    rec.start();
    recRef.current = rec;
    setIsListening(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 20, padding: '4px 0' }}>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>
          No structure, no pressure. Just get it out of your head.
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
          <textarea
            placeholder="Brain dump here — whatever's rattling around in your head..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={6}
            style={{ width: '100%', border: 'none', outline: 'none', padding: '16px 18px', fontSize: 15, fontFamily: 'var(--font-serif)', color: 'var(--ink)', background: 'transparent', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 18px', borderTop: '1px solid var(--line)', background: 'var(--bg)' }}>
            <button onClick={toggleVoice} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: `1px solid ${isListening ? 'var(--primary)' : 'var(--line)'}`, background: isListening ? 'var(--primary)' : 'transparent', color: isListening ? 'white' : 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>{isListening ? '🔴 Stop' : '🎙 Voice'}</button>
            <div style={{ flex: 1, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{text.split(/\s+/).filter(Boolean).length} words</div>
            <button onClick={save} className="btn btn--pink" style={{ fontSize: 13 }}>Dump it</button>
          </div>
        </div>
      </div>

      {dumps.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>No brain dumps yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dumps.map(d => (
            <div key={d.id} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', position: 'relative' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: 6 }}>{d.date}</div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{d.text}</div>
              <button onClick={() => remove(d.id)} style={{ position: 'absolute', top: 10, right: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main JournalView ──────────────────────────────────────────────────────────

export default function JournalView({ state, setState }) {
  const journal = state.journal || [];
  const pin = state.journalPin;
  const [unlocked, setUnlocked] = useState(!pin);
  const [tab, setTab] = useState('entries');
  const [pendingPrompt, setPendingPrompt] = useState('');
  const [showPinSetup, setShowPinSetup] = useState(false);

  const setPin = (newPin) => {
    setState(s => ({ ...s, journalPin: newPin }));
    setUnlocked(true);
    setShowPinSetup(false);
  };

  const removePin = () => {
    setState(s => ({ ...s, journalPin: null }));
    setUnlocked(true);
  };

  const TABS = [
    { id: 'entries', label: 'Entries' },
    { id: 'mood', label: 'Mood' },
    { id: 'prompts', label: 'Prompts' },
    { id: 'dump', label: 'Brain Dump' },
  ];

  const latestDate = journal[0]?.date;
  const thisMonth = journal.filter(j => {
    try { const d = new Date(j.date); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); } catch { return false; }
  }).length;
  const todayMood = (state.moodLog || {})[todayKey()];
  const todayMoodLevel = todayMood ? MOOD_LEVELS[todayMood.level - 1] : null;

  if (!unlocked) {
    return (
      <>
        <div className="page-head">
          <div>
            <div className="page-head__greeting">Personal Journal</div>
            <h1 className="page-head__title">Your inner world</h1>
          </div>
        </div>
        <LockScreen pin={pin} onUnlock={() => setUnlocked(true)} onSetPin={setPin} />
      </>
    );
  }

  if (showPinSetup) {
    return (
      <>
        <div className="page-head">
          <div>
            <div className="page-head__greeting">Personal Journal</div>
            <h1 className="page-head__title">Your inner world</h1>
          </div>
        </div>
        <LockScreen pin={null} onUnlock={() => setShowPinSetup(false)} onSetPin={setPin} />
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-head__greeting">Personal Journal · A space that's entirely yours</div>
          <h1 className="page-head__title">Your inner world</h1>
          <div className="page-head__date mt-sm">
            {journal.length} {journal.length === 1 ? 'entry' : 'entries'} · {thisMonth} this month{latestDate ? ` · last written ${latestDate}` : ''}
          </div>
        </div>
        <div className="row gap-md" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          {todayMoodLevel && <Pill tone="pink" mono>{todayMoodLevel.emoji} {todayMoodLevel.label}</Pill>}
          <Pill tone="lilac" mono>{journal.length} entries</Pill>
          <button
            onClick={() => pin ? removePin() : setShowPinSetup(true)}
            style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {pin ? '🔓 Remove lock' : '🔐 Add lock'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: 'var(--line)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: tab === t.id ? 'var(--card)' : 'transparent',
            color: tab === t.id ? 'var(--ink)' : 'var(--muted)',
            fontWeight: tab === t.id ? 600 : 500, fontSize: 13,
            boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'entries' && <EntriesTab state={state} setState={setState} prefillPrompt={pendingPrompt} onClearPrompt={() => setPendingPrompt('')} />}
      {tab === 'mood' && <MoodTab state={state} setState={setState} />}
      {tab === 'prompts' && <PromptsTab onUsePrompt={p => { setPendingPrompt(p); setTab('entries'); }} />}
      {tab === 'dump' && <BrainDumpTab state={state} setState={setState} />}
    </>
  );
}
