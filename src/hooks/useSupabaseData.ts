import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../utils/upload';
import { MemePost, Publication, Conference, BlogPost, UserProfile, EducationItem } from '../../types';
import {
    DEFAULT_PROFILE,
    DEFAULT_EDUCATION,
    PUBLICATIONS as INIT_PUBS,
    CONFERENCES as INIT_CONFS,
    MEMES as INIT_MEMES,
    BLOG_POSTS as INIT_BLOGS
} from '../../constants';

export const useSupabaseData = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [memes, setMemes] = useState<MemePost[]>(INIT_MEMES);
    const [publications, setPublications] = useState<Publication[]>(INIT_PUBS);
    const [conferences, setConferences] = useState<Conference[]>(INIT_CONFS);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INIT_BLOGS);
    const [education, setEducation] = useState<EducationItem[]>(DEFAULT_EDUCATION);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Profile
            const { data: profileData } = await supabase.from('profiles').select('*').single();
            if (profileData) {
                setProfile({
                    ...DEFAULT_PROFILE,
                    ...profileData,
                    nameZh: profileData.name_zh,
                    titleZh: profileData.title_zh,
                    affiliationZh: profileData.affiliation_zh,
                    bioZh: profileData.bio_zh,
                    coverTitle: profileData.cover_title,
                    coverTitleZh: profileData.cover_title_zh,
                    coverImage: profileData.cover_image,
                    avatarUrl: profileData.avatar_url,
                    mottoZh: profileData.motto_zh,
                    cvPdfUrl: profileData.cv_pdf_url
                });
            }

            // 2. Fetch Memes
            const { data: memesData } = await supabase.from('meme_posts').select('*').order('created_at', { ascending: false });
            if (memesData) setMemes(memesData.map(m => ({ ...m, imageUrl: m.image_url })));

            // 3. Fetch Publications
            const { data: pubsData } = await supabase.from('publications').select('*').order('year', { ascending: false });
            if (pubsData) setPublications(pubsData);

            // 4. Fetch Conferences
            const { data: confData } = await supabase.from('conferences').select('*').order('created_at', { ascending: false });
            if (confData) setConferences(confData);

            // 5. Fetch Blogs
            const { data: blogData } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
            if (blogData) setBlogPosts(blogData);

            // 6. Fetch Education
            const { data: eduData } = await supabase.from('education').select('*').order('created_at', { ascending: false });
            if (eduData) setEducation(eduData);

        } catch (error) {
            console.error("Error loading data from Supabase:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Actions ---

    const updateProfile = async (newProfile: UserProfile) => {
        // Optimistic update
        setProfile(newProfile);

        // Upload images if they are base64 (newly cropped/selected)
        let avatarUrl = newProfile.avatarUrl;
        let coverImage = newProfile.coverImage;

        if (avatarUrl && avatarUrl.startsWith('data:')) {
            const url = await uploadImage(avatarUrl, 'avatars');
            if (url) avatarUrl = url;
        }
        if (coverImage && coverImage.startsWith('data:')) {
            const url = await uploadImage(coverImage, 'covers');
            if (url) coverImage = url;
        }

        // Map to DB columns
        const dbProfile = {
            name: newProfile.name,
            title: newProfile.title,
            affiliation: newProfile.affiliation,
            bio: newProfile.bio,
            motto: newProfile.motto,
            name_zh: newProfile.nameZh,
            title_zh: newProfile.titleZh,
            affiliation_zh: newProfile.affiliationZh,
            bio_zh: newProfile.bioZh,
            motto_zh: newProfile.mottoZh,
            avatar_url: avatarUrl,
            cover_image: coverImage,
            cover_title: newProfile.coverTitle,
            cover_title_zh: newProfile.coverTitleZh,
            cv_pdf_url: newProfile.cvPdfUrl
        };

        const { error } = await supabase.from('profiles').upsert(dbProfile, { onConflict: 'key' });
        if (error) {
            // If error is duplicate key, try just update without key, assuming only one profile exists or we handle ID differently.
            // Actually we can query ID or just rely on RLS logic "update own profile".
            // Since we created table with default key, let's assume we updating the single row.
            // Best way: check if profile has ID, otherwise insert with 'admin' key logic if we used it.
            // For simplicity, we assume one row or we use a hardcoded known ID/Key if needed.
            // Actually, Supabase upsert needs a constraint.
            // In schema we said: key text not null unique. Let's add key: 'admin' if creating.
            await supabase.from('profiles').upsert({ ...dbProfile, key: 'admin' }, { onConflict: 'key' });
        }
    };

    const addMeme = async (meme: { title: string, caption: string, imageUrl: string }) => {
        // Upload image first
        let imageUrl = meme.imageUrl;
        if (imageUrl.startsWith('data:')) {
            const url = await uploadImage(imageUrl, 'memes');
            if (url) imageUrl = url;
        }
        const { error } = await supabase.from('meme_posts').insert([{
            title: meme.title,
            caption: meme.caption,
            image_url: imageUrl
        }]);
        if (!error) fetchData();
    };

    const deleteMeme = async (id: string) => {
        setMemes(memes.filter(m => m.id !== id));
        await supabase.from('meme_posts').delete().eq('id', id);
    };

    const addPublication = async (pub: Publication) => {
        const { id, ...rest } = pub; // remove ID to let DB generate it, or keep it.
        // Local defined IDs are timestamp strings, DB are UUIDs. Ideally let DB generate.
        await supabase.from('publications').insert([{
            title: pub.title, authors: pub.authors, venue: pub.venue, year: pub.year, url: pub.url
        }]);
        fetchData();
    };

    const updatePublication = async (id: string, field: string, value: any) => {
        setPublications(publications.map(p => p.id === id ? { ...p, [field]: value } : p));
        await supabase.from('publications').update({ [field]: value }).eq('id', id);
    };

    const deletePublication = async (id: string) => {
        setPublications(publications.filter(p => p.id !== id));
        await supabase.from('publications').delete().eq('id', id);
    };

    const addConference = async (conf: Conference) => {
        await supabase.from('conferences').insert([{
            title: conf.title, event: conf.event, date: conf.date, location: conf.location
        }]);
        fetchData();
    };

    const updateConference = async (id: string, field: string, value: any) => {
        setConferences(conferences.map(c => c.id === id ? { ...c, [field]: value } : c));
        await supabase.from('conferences').update({ [field]: value }).eq('id', id);
    };

    const deleteConference = async (id: string) => {
        setConferences(conferences.filter(c => c.id !== id));
        await supabase.from('conferences').delete().eq('id', id);
    };

    const addBlogPost = async (post: BlogPost) => {
        // Handle image upload if needed? Post might have 'image' field locally as url or base64?
        // Assuming URL for now unless we add upload to blog editor.
        const { id, ...rest } = post;
        await supabase.from('blog_posts').insert([{
            title: post.title, content: post.content, category: post.category, excerpt: post.excerpt,
            date: post.date, image: post.image, tags: post.tags
        }]);
        fetchData();
    };

    const deleteBlogPost = async (id: string) => {
        setBlogPosts(blogPosts.filter(p => p.id !== id));
        await supabase.from('blog_posts').delete().eq('id', id);
    };

    const addEducation = async (edu: EducationItem) => {
        await supabase.from('education').insert([{
            degree: edu.degree, school: edu.school, year: edu.year, color: edu.color
        }]);
        fetchData();
    };

    const updateEducation = async (id: string, edu: EducationItem) => {
        // update all fields
        setEducation(education.map(e => e.id === id ? edu : e));
        await supabase.from('education').update({
            degree: edu.degree, school: edu.school, year: edu.year, color: edu.color
        }).eq('id', id);
    };

    const deleteEducation = async (id: string) => {
        setEducation(education.filter(e => e.id !== id));
        await supabase.from('education').delete().eq('id', id);
    };


    return {
        loading,
        profile,
        memes,
        publications,
        conferences,
        blogPosts,
        education,
        // Actions
        updateProfile,
        addMeme, deleteMeme,
        addPublication, updatePublication, deletePublication,
        addConference, updateConference, deleteConference,
        addBlogPost, deleteBlogPost,
        addEducation, updateEducation, deleteEducation,
        refresh: fetchData
    };
};
