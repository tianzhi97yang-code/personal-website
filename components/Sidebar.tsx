
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  FileText,
  Mic,
  PenTool,
  Moon,
  Sun,
  Globe,
  Lock,
  Unlock,
  User
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, ThemeMode, UserProfile } from '../types';

interface SidebarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  profile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({
  language,
  setLanguage,
  theme,
  setTheme,
  isAdmin,
  setIsAdmin,
  profile
}) => {
  const location = useLocation();
  const t = TRANSLATIONS[language];

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 mb-2 group
        ${isActive(to)
          ? 'bg-white dark:bg-stone-800 shadow-sm text-rose-500 dark:text-rose-400 font-bold translate-x-2'
          : 'text-soft-brown dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50 hover:text-deep-brown dark:hover:text-stone-200'
        }`}
    >
      <Icon size={20} className={isActive(to) ? "animate-bounce" : "group-hover:scale-110 transition-transform"} />
      <span className="tracking-wide font-sans text-sm lg:text-base">{label}</span>
    </Link>
  );

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      // Simple mock auth
      const password = prompt("Enter owner password (hint: 'First pet dog's name'):");
      if (password === 'Sunny') {
        setIsAdmin(true);
      } else if (password !== null) {
        alert("Wrong password");
      }
    }
  };

  return (
    <aside className="w-full lg:w-72 lg:h-screen flex flex-col p-6 lg:sticky lg:top-0">
      {/* Header / Profile */}
      <div className="flex flex-col items-center mb-8 lg:mb-12">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-stone-700 shadow-lg mb-4 transition-colors group">
          <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          {isAdmin && <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-xs">Edit on Page</div>}
        </div>
        <h1 className="font-serif text-2xl font-bold text-deep-brown dark:text-warm-cream text-center">
          {language === Language.ZH ? (profile.nameZh || profile.name) : profile.name}
        </h1>
        <p className="text-sm text-soft-brown dark:text-stone-500 font-sans mt-1 text-center px-2">
          {language === Language.ZH ? (profile.titleZh || profile.title) : profile.title}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <NavItem to="/app/home" icon={Home} label={t.menu.home} />
        <NavItem to="/app/cv" icon={FileText} label={t.menu.cv} />
        <NavItem to="/app/publications" icon={BookOpen} label={t.menu.publications} />
        <NavItem to="/app/conferences" icon={Mic} label={t.menu.conferences} />
        <NavItem to="/app/blog" icon={PenTool} label={t.menu.blog} />
      </nav>

      {/* Cute Decoration Area */}
      <div className="my-6 p-4 bg-white/40 dark:bg-stone-800/40 rounded-3xl text-center border border-warm-paper dark:border-stone-700 backdrop-blur-sm">
        <p className="text-xs text-soft-brown dark:text-stone-500 font-serif italic max-w-[200px] mx-auto break-words">
          "{language === Language.ZH ? (profile.mottoZh || profile.motto) : profile.motto || "Stay academic, stay cozy."}"
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage(language === Language.EN ? Language.ZH : Language.EN)}
            className="p-2 rounded-full hover:bg-warm-paper dark:hover:bg-stone-800 text-soft-brown dark:text-stone-400 transition-colors flex items-center gap-2 text-xs font-bold"
          >
            <Globe size={18} />
            {language}
          </button>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full hover:bg-warm-paper dark:hover:bg-stone-800 text-soft-brown dark:text-stone-400 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <button
          onClick={handleAdminToggle}
          className={`p-2 rounded-full transition-colors ${isAdmin ? 'text-rose-500 bg-rose-100 dark:bg-rose-900/20' : 'text-soft-brown dark:text-stone-400 hover:bg-warm-paper dark:hover:bg-stone-800'}`}
          title={isAdmin ? t.misc.logout : t.misc.adminLogin}
        >
          {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
