import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Layout, Edit3, Save, Trash2, Plus, X, 
  ChevronRight, Settings, Database, Loader2, LogOut
} from 'lucide-react';

// --- 1. SETUP SUPABASE CONNECTION ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 2. COMPONENTS ---

const GlowingButton = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`relative px-6 py-3 font-bold uppercase text-xs transition-all border border-theme-primary text-theme-primary hover:bg-theme-primary/10 hover:shadow-[0_0_15px_rgba(var(--primary-color),0.4)] ${className}`}>
    <span className="flex items-center gap-2">{children}</span>
  </button>
);

const SectionFrame = ({ children, className }) => (
  <div className={`relative border border-gray-800 bg-theme-panel/50 backdrop-blur-sm p-6 md:p-10 group ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-theme-primary"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-theme-primary"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-theme-primary"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-theme-primary"></div>
    {children}
  </div>
);

const Editable = ({ value, onChange, isArea, className }) => {
  return isArea ? (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-black/50 border border-theme-primary/50 text-white p-2 outline-none focus:border-theme-primary ${className}`}/>
  ) : (
    <input value={value} onChange={(e) => onChange(e.target.value)} className={`bg-black/50 border border-theme-primary/50 text-white px-2 py-1 outline-none focus:border-theme-primary ${className}`}/>
  );
};

// --- 3. SECTION RENDERERS ---

const HeroRenderer = ({ data, isAdmin, onUpdate }) => (
  <div className="min-h-[70vh] flex flex-col justify-center items-center text-center relative z-10">
    <div className="mb-4 flex items-center gap-2 text-theme-primary font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
      <span className="w-2 h-2 bg-theme-primary rounded-full"></span> System Online
    </div>
    {isAdmin ? (
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <Editable value={data.title} onChange={v => onUpdate({...data, title: v})} className="text-5xl font-black text-center" />
        <Editable value={data.subtitle} onChange={v => onUpdate({...data, subtitle: v})} className="text-xl font-mono text-center text-theme-primary" />
        <Editable value={data.tagline} onChange={v => onUpdate({...data, tagline: v})} isArea className="text-center" />
      </div>
    ) : (
      <>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter shadow-theme-primary drop-shadow-[0_0_15px_rgba(var(--primary-color),0.5)]">{data.title}</h1>
        <h2 className="text-xl md:text-2xl text-theme-primary font-mono mb-8 tracking-widest border-b border-theme-primary/30 pb-2">{data.subtitle}</h2>
        <p className="text-theme-muted max-w-xl text-lg">{data.tagline}</p>
      </>
    )}
  </div>
);

const TimelineRenderer = ({ data, isAdmin, onUpdate }) => (
  <div className="max-w-4xl mx-auto py-20 px-4">
    <div className="flex items-center gap-4 mb-10">
      <div className="h-px bg-theme-primary flex-1 opacity-30"></div>
      <h3 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
        <Database size={20} className="text-theme-primary"/> {isAdmin ? <Editable value={data.heading} onChange={v => onUpdate({...data, heading: v})} /> : data.heading}
      </h3>
      <div className="h-px bg-theme-primary flex-1 opacity-30"></div>
    </div>
    <div className="space-y-6">
      {data.items.map((item, i) => (
        <SectionFrame key={i} className="flex flex-col md:flex-row gap-6 items-start relative group hover:bg-theme-panel transition-colors">
           {isAdmin && (
             <button onClick={() => { const n=data.items.filter((_, idx) => idx !== i); onUpdate({...data, items: n}); }} className="absolute top-2 right-2 text-red-500"><Trash2 size={16}/></button>
           )}
           <div className="w-12 h-12 bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center shrink-0">
              <span className="font-mono text-theme-primary text-xs">0{i+1}</span>
           </div>
           <div className="flex-1">
              {isAdmin ? (
                 <div className="grid gap-2">
                    <Editable value={item.role} onChange={v => { const n=[...data.items]; n[i].role=v; onUpdate({...data,items:n}) }} />
                    <Editable value={item.company} onChange={v => { const n=[...data.items]; n[i].company=v; onUpdate({...data,items:n}) }} />
                    <Editable value={item.date} onChange={v => { const n=[...data.items]; n[i].date=v; onUpdate({...data,items:n}) }} />
                    <Editable value={item.desc} onChange={v => { const n=[...data.items]; n[i].desc=v; onUpdate({...data,items:n}) }} isArea />
                 </div>
              ) : (
                 <>
                    <h4 className="text-xl font-bold text-white">{item.role}</h4>
                    <div className="flex items-center gap-2 text-xs font-mono text-theme-primary mb-2"><span>{item.company}</span> <span>//</span> <span>{item.date}</span></div>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                 </>
              )}
           </div>
        </SectionFrame>
      ))}
      {isAdmin && <button onClick={() => onUpdate({...data, items: [...data.items, { role: "New", company: "Co", date: "Year", desc: "..." }]})} className="w-full py-3 border border-dashed border-gray-700 text-gray-500 hover:text-white flex justify-center items-center gap-2"><Plus size={16}/> Add Entry</button>}
    </div>
  </div>
);

// --- 4. MAIN APPLICATION ---

export default function App() {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Auth States
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchData();
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Dynamic Color Update
  useEffect(() => {
    if (appData?.themeColor) {
      document.documentElement.style.setProperty('--primary-color', appData.themeColor);
    }
  }, [appData]);

  // 3. Admin Key Listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        if (session) {
           // Already logged in? Just toggle UI or do nothing
           alert("You are already logged in as Admin.");
        } else {
           setShowLogin(true);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [session]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('site_content').select('content').eq('id', 1).single();
      if (error) throw error;
      setAppData(data.content);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('site_content').update({ content: appData }).eq('id', 1);
      if (error) throw error;
      alert("System Updated Successfully");
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else setShowLogin(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Helper Functions
  const updateSection = (id, newContent) => {
    setAppData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, content: newContent } : s)
    }));
  };

  const addSection = (type) => {
    const id = `${type}-${Date.now()}`;
    let content = type === 'text' ? { heading: "New", text: "..." } : { heading: "Timeline", items: [] };
    setAppData(prev => ({ ...prev, sections: [...prev.sections, { id, type, content }] }));
  };

  const deleteSection = (id) => {
    if(confirm("Delete section?")) setAppData(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  if (loading) return <div className="h-screen bg-theme-bg flex items-center justify-center text-theme-primary"><Loader2 className="animate-spin" size={48}/></div>;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans relative overflow-x-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-theme-primary/5 to-transparent h-[200%] animate-scan pointer-events-none"></div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur">
          <form onSubmit={handleLogin} className="bg-theme-panel border border-theme-primary p-8 rounded w-80">
            <h3 className="text-xl font-bold mb-4 text-white">Admin Authentication</h3>
            <input type="email" placeholder="Email" className="w-full bg-black border border-gray-700 p-2 mb-3 text-white" onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full bg-black border border-gray-700 p-2 mb-4 text-white" onChange={e=>setPassword(e.target.value)} />
            <button type="submit" className="w-full bg-theme-primary text-black font-bold py-2 rounded">Login</button>
            <button type="button" onClick={()=>setShowLogin(false)} className="w-full mt-2 text-gray-500 text-sm">Cancel</button>
          </form>
        </div>
      )}

      {/* ADMIN PANEL */}
      <AnimatePresence>
        {session && (
          <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="fixed right-0 top-0 bottom-0 w-80 bg-theme-panel border-l border-theme-primary z-50 p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
               <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20}/> CONTROLS</h2>
               <button onClick={handleLogout}><LogOut size={20} className="text-red-500"/></button>
            </div>
            
            <div className="mb-8">
              <label className="text-xs font-mono text-gray-400 mb-2 block uppercase">Theme Color</label>
              <div className="flex gap-2">
                <input type="color" value={appData.themeColor} onChange={(e) => setAppData({...appData, themeColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-none"/>
                <input type="text" value={appData.themeColor} onChange={(e) => setAppData({...appData, themeColor: e.target.value})} className="flex-1 bg-black border border-gray-700 px-3 text-white font-mono rounded"/>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <label className="text-xs font-mono text-gray-400 mb-2 block uppercase">Add Modules</label>
              <button onClick={() => addSection('text')} className="w-full text-left p-3 hover:bg-white/5 border border-gray-700 rounded flex items-center gap-2 text-sm"><Plus size={14}/> Add Text Block</button>
              <button onClick={() => addSection('timeline')} className="w-full text-left p-3 hover:bg-white/5 border border-gray-700 rounded flex items-center gap-2 text-sm"><Plus size={14}/> Add Timeline</button>
            </div>

            <div className="pt-6 border-t border-gray-700">
               <button onClick={saveData} disabled={saving} className="w-full bg-theme-primary text-black font-bold py-3 rounded flex items-center justify-center gap-2">
                 {saving ? <Loader2 className="animate-spin"/> : <Save size={18}/>} SAVE CHANGES
               </button>
               <p className="text-xs text-gray-500 mt-2 text-center">Changes publish immediately.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV */}
      <nav className="border-b border-gray-800 bg-theme-bg/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
           <div className="font-black text-xl tracking-tighter flex items-center gap-2 text-white">
             <div className="w-8 h-8 bg-theme-primary flex items-center justify-center text-black font-bold">TK</div>
             LOGISTICS.OS
           </div>
           {!session && <div className="text-xs text-gray-500 font-mono hidden md:block">ADMIN: CTRL+SHIFT+A</div>}
        </div>
      </nav>

      {/* CONTENT */}
      <div className={`transition-all duration-300 ${session ? 'mr-80' : ''} pb-20`}>
        {appData?.sections.map((section) => (
          <div key={section.id} className="relative group">
             {session && <button onClick={() => deleteSection(section.id)} className="absolute top-4 right-4 z-30 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>}
             {section.type === 'hero' && <HeroRenderer data={section.content} isAdmin={!!session} onUpdate={c => updateSection(section.id, c)} />}
             {section.type === 'timeline' && <TimelineRenderer data={section.content} isAdmin={!!session} onUpdate={c => updateSection(section.id, c)} />}
             {section.type === 'text' && (
               <div className="max-w-3xl mx-auto py-10 px-6 text-center">
                  {session ? <Editable value={section.content.heading} onChange={v => updateSection(section.id, {...section.content, heading: v})} className="text-2xl font-bold mx-auto block mb-4" /> : <h2 className="text-2xl font-bold text-white mb-4">{section.content.heading}</h2>}
                  {session ? <Editable value={section.content.text} isArea onChange={v => updateSection(section.id, {...section.content, text: v})} className="min-h-[100px]" /> : <p className="text-gray-400 leading-relaxed">{section.content.text}</p>}
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}