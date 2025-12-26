
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { Language, ThemeMode, MemePost, Publication, Conference, BlogPost, UserProfile, EducationItem } from './types';
import { TRANSLATIONS, PUBLICATIONS as INIT_PUBS, CONFERENCES as INIT_CONFS, BLOG_POSTS as INIT_BLOGS, MEMES as INIT_MEMES, DEFAULT_PROFILE, DEFAULT_EDUCATION } from './constants';
import Sidebar from './components/Sidebar';
import CommentSection from './components/CommentSection';
import { Search, Tag, Calendar, MapPin, ExternalLink, Download, Plus, Trash2, Save, X, Edit2, Image as ImageIcon } from 'lucide-react';

// --- Hooks for LocalStorage ---
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// --- Components ---

const CoverPage = ({ onEnter, language, profile }: { onEnter: () => void, language: Language, profile: UserProfile }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center cursor-pointer group" onClick={onEnter}>
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105" style={{ backgroundImage: `url('${profile.coverImage || "https://picsum.photos/seed/cozyroom/1920/1080"}')` }}></div>
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] group-hover:bg-stone-900/30 transition-colors"></div>
      <div className="relative z-10 text-center text-white p-12 border border-white/20 bg-white/10 backdrop-blur-md rounded-[3rem] shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-rose-500/20">
        <h1 className="font-serif text-5xl md:text-7xl mb-4 tracking-tight text-warm-cream drop-shadow-lg">
          {language === Language.ZH ? (profile.coverTitleZh || profile.coverTitle || "Cozy Scholar") : (profile.coverTitle || "Cozy Scholar")}
        </h1>
        <div className="w-16 h-1 bg-rose-300 mx-auto mb-6 rounded-full"></div>
        <p className="font-sans text-lg md:text-xl tracking-widest uppercase opacity-90">
          {TRANSLATIONS[language].enter}
        </p>
        <p className="mt-4 text-xs opacity-70 animate-pulse">
          (Click anywhere)
        </p>
      </div>
    </div>
  );
};

const HomePage = ({ language, memes, setMemes, isAdmin }: { language: Language, memes: MemePost[], setMemes: any, isAdmin: boolean }) => {
  const [newMeme, setNewMeme] = useState({ title: '', caption: '', imageUrl: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newMeme.imageUrl) return;
    setMemes([{ id: Date.now().toString(), ...newMeme }, ...memes]);
    setNewMeme({ title: '', caption: '', imageUrl: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this poster?")) setMemes(memes.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-deep-brown dark:text-warm-cream">
            {TRANSLATIONS[language].menu.home}
          </h2>
          <p className="text-soft-brown dark:text-stone-400 mt-2">
            Welcome to my personal space. Here are some things currently on my mind (or wall).
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsAdding(!isAdding)} className="bg-rose-400 text-white p-2 rounded-full hover:bg-rose-500 transition-colors shadow-md">
            {isAdding ? <X size={20} /> : <Plus size={20} />}
          </button>
        )}
      </header>

      {isAdmin && isAdding && (
        <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-md mb-8 animate-fade-in border-2 border-rose-200 dark:border-rose-900/50">
          <h3 className="font-bold text-rose-500 mb-4">Add New Poster/Meme</h3>
          <div className="grid gap-4">
            <input type="file" accept="image/*" onChange={e => {
              if (e.target.files?.[0]) {
                const reader = new FileReader();
                reader.onloadend = () => setNewMeme({ ...newMeme, imageUrl: reader.result as string });
                reader.readAsDataURL(e.target.files[0]);
              }
            }} className="p-3 rounded-xl bg-warm-cream dark:bg-stone-900 w-full outline-none text-sm text-deep-brown dark:text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
            {newMeme.imageUrl && <div className="w-full h-32 bg-stone-100 rounded-xl overflow-hidden"><img src={newMeme.imageUrl} className="w-full h-full object-cover" /></div>}
            <input placeholder="Title" value={newMeme.title} onChange={e => setNewMeme({ ...newMeme, title: e.target.value })} className="p-3 rounded-xl bg-warm-cream dark:bg-stone-900 w-full outline-none" />
            <input placeholder="Caption" value={newMeme.caption} onChange={e => setNewMeme({ ...newMeme, caption: e.target.value })} className="p-3 rounded-xl bg-warm-cream dark:bg-stone-900 w-full outline-none" />
            <button onClick={handleAdd} className="bg-rose-500 text-white px-6 py-2 rounded-xl font-bold w-fit ml-auto">Post It</button>
          </div>
        </div>
      )}

      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {memes.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group bg-white dark:bg-stone-800 p-3 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            {isAdmin && (
              <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 z-10 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            )}
            <div className="overflow-hidden rounded-2xl mb-3">
              <img src={item.imageUrl} alt={item.title} className="w-full h-auto hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="px-2 pb-2">
              <h3 className="font-bold font-serif text-lg text-deep-brown dark:text-stone-200">{item.title}</h3>
              <p className="text-sm text-soft-brown dark:text-stone-400 italic mt-1">"{item.caption}"</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 opacity-50">
        <div className="flex gap-4 text-4xl">🌿 🐈 📚</div>
      </div>
    </div>
  );
};

const CVPage = ({ language, profile, setProfile, education, setEducation, isAdmin }: { language: Language, profile: UserProfile, setProfile: any, education: EducationItem[], setEducation: any, isAdmin: boolean }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const saveProfile = () => {
    setProfile(tempProfile);
    setIsEditingProfile(false);
  };

  const deleteEdu = (id: string) => {
    if (window.confirm("Remove this education item?")) setEducation(education.filter(e => e.id !== id));
  };

  const addEdu = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: "New Degree",
      school: "New School",
      year: "2024",
      color: "bg-rose-200"
    };
    setEducation([newEdu, ...education]);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-stone-800 p-8 md:p-12 rounded-[2rem] shadow-sm min-h-[80vh]">
      <div className="flex justify-between items-start border-b-2 border-warm-paper dark:border-stone-700 pb-8 mb-8">
        <div className="w-full">
          {isAdmin && !isEditingProfile && (
            <button onClick={() => setIsEditingProfile(true)} className="mb-2 text-xs bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-stone-200"><Edit2 size={12} /> Edit Bio</button>
          )}

          {isEditingProfile ? (
            <div className="space-y-3 w-full bg-stone-50 dark:bg-stone-900/50 p-6 rounded-2xl border border-stone-100 dark:border-stone-700">
              <h4 className="font-bold text-rose-500 text-sm uppercase tracking-wider mb-2">My Little Secrets (Cover Page)</h4>
              <input placeholder="Cover Page Title" className="text-xl font-serif font-bold text-deep-brown dark:text-stone-200 w-full bg-transparent border-b border-rose-300 outline-none" value={tempProfile.coverTitle || ''} onChange={e => setTempProfile({ ...tempProfile, coverTitle: e.target.value })} />
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-soft-brown whitespace-nowrap">Cover Background:</span>
                <input type="file" accept="image/*" onChange={e => {
                  if (e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => setTempProfile({ ...tempProfile, coverImage: reader.result as string });
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} className="text-xs text-soft-brown dark:text-stone-500 w-full bg-transparent border-b border-rose-300 outline-none file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
              </div>

              <h4 className="font-bold text-rose-500 text-sm uppercase tracking-wider mb-2 pt-2 border-t border-stone-200 dark:border-stone-700">Public Profile (English)</h4>
              <input className="text-4xl font-serif font-bold text-deep-brown dark:text-stone-200 w-full bg-transparent border-b border-rose-300 outline-none" value={tempProfile.name} onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })} />
              <input className="text-rose-500 font-bold w-full bg-transparent border-b border-rose-300 outline-none" value={tempProfile.title} onChange={e => setTempProfile({ ...tempProfile, title: e.target.value })} />
              <input placeholder="Motto" className="text-soft-brown dark:text-stone-400 w-full bg-transparent border-b border-rose-300 outline-none italic" value={tempProfile.motto || ''} onChange={e => setTempProfile({ ...tempProfile, motto: e.target.value })} />
              <input className="text-soft-brown dark:text-stone-400 w-full bg-transparent border-b border-rose-300 outline-none" value={tempProfile.affiliation} onChange={e => setTempProfile({ ...tempProfile, affiliation: e.target.value })} />
              <textarea className="w-full bg-transparent border border-rose-300 rounded-lg p-2 mt-2 outline-none text-sm" rows={4} value={tempProfile.bio} onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })} />

              <h4 className="font-bold text-rose-500 text-sm uppercase tracking-wider mb-2 pt-2 border-t border-stone-200 dark:border-stone-700">Public Profile (Chinese)</h4>
              <input placeholder="姓名 (中文)" className="text-4xl font-serif font-bold text-deep-brown dark:text-stone-200 w-full bg-transparent border-b border-rose-300 outline-none" value={tempProfile.nameZh || ''} onChange={e => setTempProfile({ ...tempProfile, nameZh: e.target.value })} />
              <input placeholder="头衔 (中文)" className="text-rose-500 font-bold w-full bg-transparent border-b border-rose-300 outline-none" value={tempProfile.titleZh || ''} onChange={e => setTempProfile({ ...tempProfile, titleZh: e.target.value })} />
              <input placeholder="座右铭 (中文)" className="text-soft-brown dark:text-stone-400 w-full bg-transparent border-b border-rose-300 outline-none italic" value={tempProfile.mottoZh || ''} onChange={e => setTempProfile({ ...tempProfile, mottoZh: e.target.value })} />
              <input placeholder="机构 (中文)" className="text-soft-brown dark:text-stone-400 w-full bg-transparent border-b border-rose-300 outline-none" value={tempProfile.affiliationZh || ''} onChange={e => setTempProfile({ ...tempProfile, affiliationZh: e.target.value })} />
              <textarea placeholder="简介 (中文)" className="w-full bg-transparent border border-rose-300 rounded-lg p-2 mt-2 outline-none text-sm" rows={4} value={tempProfile.bioZh || ''} onChange={e => setTempProfile({ ...tempProfile, bioZh: e.target.value })} />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-soft-brown whitespace-nowrap">Avatar:</span>
                <input type="file" accept="image/*" onChange={e => {
                  if (e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => setTempProfile({ ...tempProfile, avatarUrl: reader.result as string });
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} className="text-xs text-soft-brown dark:text-stone-500 w-full bg-transparent border-b border-rose-300 outline-none file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
              </div>
              <input placeholder="CV PDF Link" className="text-xs text-soft-brown dark:text-stone-500 w-full bg-transparent border-b border-rose-300 outline-none mt-2" value={tempProfile.cvPdfUrl || ''} onChange={e => setTempProfile({ ...tempProfile, cvPdfUrl: e.target.value })} />
              <textarea className="w-full bg-transparent border border-rose-300 rounded-lg p-2 mt-2 outline-none text-sm" rows={4} value={tempProfile.bio} onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={saveProfile} className="bg-rose-500 text-white px-3 py-1 rounded-lg text-sm">Save</button>
                <button onClick={() => setIsEditingProfile(false)} className="text-stone-500 text-sm px-2">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-serif font-bold text-deep-brown dark:text-stone-200 mb-2">
                {language === Language.ZH ? (profile.nameZh || profile.name) : profile.name}
              </h2>
              <p className="text-rose-500 font-bold">
                {language === Language.ZH ? (profile.titleZh || profile.title) : profile.title}
              </p>
              <p className="text-soft-brown dark:text-stone-400 mt-1 mb-4">
                {language === Language.ZH ? (profile.affiliationZh || profile.affiliation) : profile.affiliation}
              </p>
              <p className="text-deep-brown dark:text-stone-300 leading-relaxed max-w-xl">
                {language === Language.ZH ? (profile.bioZh || profile.bio) : profile.bio}
              </p>
            </>
          )}
        </div>
        <a href={profile.cvPdfUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-3 bg-warm-paper dark:bg-stone-700 rounded-full text-deep-brown dark:text-stone-300 hover:scale-110 transition-transform shrink-0 ml-4" title={TRANSLATIONS[language].misc.downloadCv}>
          <Download size={20} />
        </a>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl font-bold font-sans uppercase tracking-wider text-rose-400 flex items-center gap-2">
            Education
          </h3>
          {isAdmin && <button onClick={addEdu} className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 p-1 rounded-full"><Plus size={14} /></button>}
        </div>

        <div className="space-y-6 border-l-2 border-warm-paper dark:border-stone-700 ml-2 pl-6">
          {education.map((edu) => (
            <div key={edu.id} className="relative group">
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ${edu.color} border-4 border-white dark:border-stone-800`}></div>
              {isAdmin ? (
                <div className="flex items-start gap-2">
                  <div className="flex-1 grid gap-2">
                    <input value={edu.degree} onChange={(e) => setEducation(education.map(i => i.id === edu.id ? { ...i, degree: e.target.value } : i))} className="font-bold text-lg bg-transparent border-b border-stone-200 dark:border-stone-700 outline-none dark:text-stone-200" />
                    <input value={edu.school} onChange={(e) => setEducation(education.map(i => i.id === edu.id ? { ...i, school: e.target.value } : i))} className="text-soft-brown bg-transparent border-b border-stone-200 dark:border-stone-700 outline-none" />
                    <input value={edu.year} onChange={(e) => setEducation(education.map(i => i.id === edu.id ? { ...i, year: e.target.value } : i))} className="text-xs text-stone-400 bg-transparent outline-none" />
                  </div>
                  <button onClick={() => deleteEdu(edu.id)} className="text-red-400 opacity-50 hover:opacity-100"><Trash2 size={16} /></button>
                </div>
              ) : (
                <>
                  <h4 className="font-bold text-lg dark:text-stone-200">{edu.degree}</h4>
                  <p className="text-soft-brown dark:text-stone-400">{edu.school} • {edu.year}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const PublicationsPage = ({ language, publications, setPublications, isAdmin }: { language: Language, publications: Publication[], setPublications: any, isAdmin: boolean }) => {
  const addPub = () => {
    const newPub: Publication = { id: Date.now().toString(), title: "New Paper Title", authors: "Authors List", venue: "Conference/Journal", year: new Date().getFullYear() };
    setPublications([newPub, ...publications]);
  };

  const updatePub = (id: string, field: keyof Publication, value: string | number) => {
    setPublications(publications.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-deep-brown dark:text-warm-cream">{TRANSLATIONS[language].menu.publications}</h2>
        {isAdmin && <button onClick={addPub} className="flex items-center gap-2 bg-rose-400 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"><Plus size={16} /> Add Paper</button>}
      </div>

      <div className="grid gap-4">
        {publications.map((pub) => (
          <div key={pub.id} className="group p-6 bg-white dark:bg-stone-800 rounded-2xl border border-transparent hover:border-rose-200 dark:hover:border-stone-600 transition-all shadow-sm relative">
            {isAdmin && (
              <button onClick={() => { if (window.confirm("Delete?")) setPublications(publications.filter(p => p.id !== pub.id)); }} className="absolute top-4 right-4 text-stone-300 hover:text-red-500"><Trash2 size={16} /></button>
            )}
            {isAdmin ? (
              <div className="grid gap-2 pr-8">
                <input value={pub.title} onChange={e => updatePub(pub.id, 'title', e.target.value)} className="font-bold text-lg bg-transparent border-b border-dashed border-stone-300 w-full outline-none dark:text-stone-200" />
                <input value={pub.authors} onChange={e => updatePub(pub.id, 'authors', e.target.value)} className="text-sm italic bg-transparent border-b border-dashed border-stone-300 w-full outline-none dark:text-stone-400" />
                <div className="flex gap-4">
                  <input value={pub.venue} onChange={e => updatePub(pub.id, 'venue', e.target.value)} className="text-xs font-bold uppercase bg-transparent border-b border-dashed border-stone-300 outline-none dark:text-rose-400 text-rose-400" />
                  <input type="number" value={pub.year} onChange={e => updatePub(pub.id, 'year', parseInt(e.target.value))} className="text-xs font-bold bg-transparent border-b border-dashed border-stone-300 w-20 outline-none dark:text-stone-400" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-deep-brown dark:text-stone-200 group-hover:text-rose-500 transition-colors">{pub.title}</h3>
                  <span className="text-xs font-bold bg-warm-paper dark:bg-stone-700 px-2 py-1 rounded-lg text-soft-brown dark:text-stone-400 shrink-0 ml-2">{pub.year}</span>
                </div>
                <p className="text-sm text-soft-brown dark:text-stone-400 mt-2 mb-3 italic">{pub.authors}</p>
                <div className="flex items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  {pub.venue}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ConferencesPage = ({ language, conferences, setConferences, isAdmin }: { language: Language, conferences: Conference[], setConferences: any, isAdmin: boolean }) => {
  const addConf = () => {
    setConferences([{ id: Date.now().toString(), title: "New Talk", event: "Conference Name", date: "Date", location: "Location" }, ...conferences]);
  };
  const updateConf = (id: string, field: keyof Conference, value: string) => {
    setConferences(conferences.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif font-bold text-deep-brown dark:text-warm-cream">{TRANSLATIONS[language].menu.conferences}</h2>
        {isAdmin && <button onClick={addConf} className="flex items-center gap-2 bg-rose-400 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"><Plus size={16} /> Add Talk</button>}
      </div>

      <div className="relative border-l-2 border-rose-200 dark:border-stone-700 ml-4 space-y-12">
        {conferences.map((conf) => (
          <div key={conf.id} className="relative pl-8 group">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-stone-800 border-4 border-rose-300"></div>

            <div className="bg-white/50 dark:bg-stone-800/50 p-6 rounded-2xl backdrop-blur-sm hover:bg-white dark:hover:bg-stone-800 transition-colors relative">
              {isAdmin && <button onClick={() => { if (window.confirm("Delete?")) setConferences(conferences.filter(c => c.id !== conf.id)); }} className="absolute top-4 right-4 text-stone-300 hover:text-red-500"><Trash2 size={16} /></button>}

              {isAdmin ? (
                <div className="grid gap-2">
                  <input value={conf.date} onChange={e => updateConf(conf.id, 'date', e.target.value)} className="text-xs font-bold text-rose-500 bg-transparent border-b border-stone-300 w-full outline-none" />
                  <input value={conf.title} onChange={e => updateConf(conf.id, 'title', e.target.value)} className="text-xl font-serif font-bold dark:text-stone-200 bg-transparent border-b border-stone-300 w-full outline-none" />
                  <div className="flex gap-2">
                    <input value={conf.event} onChange={e => updateConf(conf.id, 'event', e.target.value)} className="text-sm font-bold bg-transparent border-b border-stone-300 outline-none flex-1 dark:text-stone-400" />
                    <input value={conf.location} onChange={e => updateConf(conf.id, 'location', e.target.value)} className="text-sm bg-transparent border-b border-stone-300 outline-none flex-1 dark:text-stone-400" />
                  </div>
                </div>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded-full mb-2">
                    <Calendar size={12} /> {conf.date}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-deep-brown dark:text-stone-200 mt-1">
                    {conf.title}
                  </h3>
                  <div className="mt-2 text-sm text-soft-brown dark:text-stone-400 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="font-bold">{conf.event}</span>
                    <span className="hidden sm:inline text-stone-300">•</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {conf.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogPage = ({ language, posts, setPosts, isAdmin }: { language: Language, posts: BlogPost[], setPosts: any, isAdmin: boolean }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isWriting, setIsWriting] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({ title: '', content: '', category: 'Lifestyle', tags: [], excerpt: '' });
  const categories = ['All', 'Research', 'Lifestyle', 'Hobby'];

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  const handleSavePost = () => {
    if (!newPost.title || !newPost.content) return;
    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title || "Untitled",
      content: newPost.content || "",
      category: newPost.category || "Uncategorized",
      date: new Date().toLocaleDateString(),
      excerpt: newPost.excerpt || newPost.content?.slice(0, 100) + "...",
      tags: newPost.tags || [],
      image: newPost.image
    };
    setPosts([post, ...posts]);
    setIsWriting(false);
    setNewPost({ title: '', content: '', category: 'Lifestyle', tags: [], excerpt: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete post?")) setPosts(posts.filter(p => p.id !== id));
  };

  if (isWriting) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-deep-brown dark:text-stone-200">Write New Post</h2>
          <button onClick={() => setIsWriting(false)} className="text-stone-400 hover:text-stone-600"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <input placeholder="Title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} className="w-full text-3xl font-bold p-2 bg-transparent border-b border-warm-paper outline-none dark:text-white" />
          <div className="flex gap-4">
            <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} className="p-2 rounded-lg bg-warm-paper dark:bg-stone-900 dark:text-stone-300 outline-none">
              {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Tags (comma separated)" onChange={e => setNewPost({ ...newPost, tags: e.target.value.split(',').map(t => t.trim()) })} className="flex-1 p-2 bg-transparent border-b border-warm-paper outline-none dark:text-stone-300" />
          </div>
          <input placeholder="Cover Image URL (Optional)" value={newPost.image || ''} onChange={e => setNewPost({ ...newPost, image: e.target.value })} className="w-full p-2 bg-transparent border-b border-warm-paper outline-none dark:text-stone-300 text-sm font-mono" />
          <textarea placeholder="Excerpt (Short summary)" value={newPost.excerpt} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} rows={2} className="w-full p-3 rounded-xl bg-warm-cream dark:bg-stone-900 outline-none" />
          <textarea placeholder="Write your story here..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={12} className="w-full p-4 rounded-xl bg-warm-cream dark:bg-stone-900 outline-none font-serif text-lg leading-relaxed" />
          <div className="flex justify-end pt-4">
            <button onClick={handleSavePost} className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2">
              <Save size={18} /> Publish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-warm-paper dark:border-stone-700 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-deep-brown dark:text-warm-cream">
            {TRANSLATIONS[language].menu.blog}
          </h2>
          <p className="text-soft-brown dark:text-stone-400 mt-1">Musings, drafts, and daydreams.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {isAdmin && (
            <button onClick={() => setIsWriting(true)} className="flex items-center gap-2 bg-rose-400 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:bg-rose-500 transition-colors">
              <Edit2 size={16} /> {TRANSLATIONS[language].blog.newPost}
            </button>
          )}
          <div className="flex gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                   ${activeCategory === cat
                    ? 'bg-rose-400 text-white shadow-md'
                    : 'bg-white dark:bg-stone-800 text-soft-brown dark:text-stone-400 hover:bg-rose-50 dark:hover:bg-stone-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {filteredPosts.map(post => (
          <article key={post.id} className="relative flex flex-col bg-white dark:bg-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
            {isAdmin && (
              <button onClick={() => handleDelete(post.id)} className="absolute top-4 right-4 z-10 bg-white dark:bg-stone-700 p-2 rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                <Trash2 size={18} />
              </button>
            )}
            {post.image && (
              <div className="h-48 w-full overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            )}
            <div className="p-8">
              <div className="flex gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-serif font-bold text-deep-brown dark:text-stone-200 mb-3">
                {post.title}
              </h3>
              <p className="text-soft-brown dark:text-stone-400 leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex justify-between items-center border-t border-warm-paper dark:border-stone-700 pt-6">
                <span className="text-xs text-soft-brown dark:text-stone-500 font-bold">
                  {post.date}
                </span>
                <Link to={`/app/blog/${post.id}`} className="flex items-center gap-2 text-rose-500 font-bold text-sm hover:translate-x-1 transition-transform">
                  {TRANSLATIONS[language].blog.readMore} <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const BlogDetailPage = ({ language, posts }: { language: Language, posts: BlogPost[] }) => {
  // Simplified router hook usage for the example
  const id = window.location.hash.split('/').pop();
  const post = posts.find(p => p.id === id) || posts[0];

  if (!post) return <div>Post not found</div>;

  return (
    <div className="bg-white dark:bg-stone-800 min-h-screen rounded-[3rem] p-8 md:p-12 shadow-sm">
      <Link to="/app/blog" className="inline-flex items-center gap-2 text-soft-brown dark:text-stone-500 hover:text-rose-500 mb-8 text-sm font-bold uppercase tracking-wide">
        ← Back to Blog
      </Link>

      <header className="mb-8 text-center max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 mb-4">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 rounded-full text-xs font-bold uppercase">
            {post.category}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-deep-brown dark:text-stone-100 mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-soft-brown dark:text-stone-400 font-sans text-sm">
          Published on {post.date}
        </p>
      </header>

      {post.image && (
        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-lg">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-stone dark:prose-invert prose-lg mx-auto font-serif leading-loose text-deep-brown dark:text-stone-300 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Comments - Mocked for now, would typically be separate state or DB */}
      <div className="max-w-2xl mx-auto">
        <CommentSection
          postId={post.id}
          existingComments={[]}
          language={language}
        />
      </div>
    </div>
  );
}

const MainLayout = ({
  language,
  setLanguage,
  theme,
  setTheme,
  isAdmin,
  setIsAdmin,
  profile
}: {
  language: Language,
  setLanguage: (l: Language) => void,
  theme: ThemeMode,
  setTheme: (t: ThemeMode) => void,
  isAdmin: boolean,
  setIsAdmin: (b: boolean) => void,
  profile: UserProfile
}) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen max-w-[1600px] mx-auto">
      <Sidebar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        profile={profile}
      />
      <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isAdmin, setIsAdmin] = useState(false);

  // Persistent State for Data
  const [memes, setMemes] = useStickyState<MemePost[]>(INIT_MEMES, 'cozy_memes');
  const [publications, setPublications] = useStickyState<Publication[]>(INIT_PUBS, 'cozy_pubs');
  const [conferences, setConferences] = useStickyState<Conference[]>(INIT_CONFS, 'cozy_confs');
  const [blogPosts, setBlogPosts] = useStickyState<BlogPost[]>(INIT_BLOGS, 'cozy_blogs');
  const [profile, setProfile] = useStickyState<UserProfile>(DEFAULT_PROFILE, 'cozy_profile_v3');
  const [education, setEducation] = useStickyState<EducationItem[]>(DEFAULT_EDUCATION, 'cozy_edu');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          <CoverPage
            onEnter={() => window.location.hash = '#/app/home'}
            language={language}
            profile={profile}
          />
        } />

        <Route path="/app" element={
          <MainLayout
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            profile={profile}
          />
        }>
          <Route path="home" element={<HomePage language={language} memes={memes} setMemes={setMemes} isAdmin={isAdmin} />} />
          <Route path="cv" element={<CVPage language={language} profile={profile} setProfile={setProfile} education={education} setEducation={setEducation} isAdmin={isAdmin} />} />
          <Route path="publications" element={<PublicationsPage language={language} publications={publications} setPublications={setPublications} isAdmin={isAdmin} />} />
          <Route path="conferences" element={<ConferencesPage language={language} conferences={conferences} setConferences={setConferences} isAdmin={isAdmin} />} />
          <Route path="blog" element={<BlogPage language={language} posts={blogPosts} setPosts={setBlogPosts} isAdmin={isAdmin} />} />
          <Route path="blog/:id" element={<BlogDetailPage language={language} posts={blogPosts} />} />
          <Route index element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
