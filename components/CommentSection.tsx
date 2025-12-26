import React, { useState, useRef } from 'react';
import { Comment, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  existingComments: Comment[];
  language: Language;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, existingComments, language }) => {
  const [comments, setComments] = useState<Comment[]>(existingComments);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = TRANSLATIONS[language].blog;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: nickname,
      content: message,
      date: new Date().toLocaleDateString(),
      imageUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    };

    setComments([...comments, newComment]);
    setMessage('');
    setSelectedFile(null);
    // Do not clear nickname, convenient for next comment
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-warm-paper dark:border-stone-700">
      <h3 className="font-serif text-xl text-deep-brown dark:text-stone-200 mb-6 flex items-center gap-2">
        <span className="text-2xl">💭</span> {t.comments}
      </h3>

      {/* List */}
      <div className="space-y-6 mb-10">
        {comments.length === 0 && (
          <p className="text-soft-brown dark:text-stone-500 text-sm italic text-center py-4">
            No messages yet. Be the first to say hi!
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white/60 dark:bg-stone-800/60 p-4 rounded-2xl shadow-sm backdrop-blur-sm animate-fade-in">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-bold text-rose-500 dark:text-rose-400 font-sans">{comment.author}</span>
              <span className="text-xs text-soft-brown dark:text-stone-500">{comment.date}</span>
            </div>
            <p className="text-deep-brown dark:text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            {comment.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden max-w-[200px] border border-white dark:border-stone-600">
                <img src={comment.imageUrl} alt="Visitor upload" className="w-full h-auto" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-md border border-warm-paper dark:border-stone-700">
        <h4 className="font-bold text-soft-brown dark:text-stone-400 mb-4 text-sm uppercase tracking-wider">
          {t.leaveComment}
        </h4>
        
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder={t.namePlaceholder}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 rounded-xl bg-warm-cream dark:bg-stone-900 border border-transparent focus:border-rose-300 dark:focus:border-rose-700 outline-none transition-all text-sm"
          />
          
          <textarea
            placeholder={t.commentPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-warm-cream dark:bg-stone-900 border border-transparent focus:border-rose-300 dark:focus:border-rose-700 outline-none transition-all text-sm resize-none"
          />

          {selectedFile && (
            <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg w-fit">
              <span>📎 {selectedFile.name}</span>
              <button type="button" onClick={() => setSelectedFile(null)}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
             <div className="relative">
               <input 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 ref={fileInputRef}
                 onChange={handleFileChange}
               />
               <button 
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="flex items-center gap-2 text-xs text-soft-brown dark:text-stone-400 hover:text-rose-500 transition-colors"
               >
                 <ImageIcon size={16} />
                 {t.uploadImage}
               </button>
             </div>

             <button 
               type="submit" 
               disabled={!nickname || !message}
               className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {t.submit} <Send size={14} />
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;