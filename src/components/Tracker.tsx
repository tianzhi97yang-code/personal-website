import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Tracker = () => {
    const location = useLocation();

    useEffect(() => {
        const trackVisit = async () => {
            const THROTTLE_TIME = 60 * 60 * 1000; // 1 hour
            const lastVisit = localStorage.getItem('cozy_last_visit');
            const now = Date.now();

            // If visited recently (within 1 hour), skip tracking
            if (lastVisit && (now - parseInt(lastVisit)) < THROTTLE_TIME) {
                return;
            }

            // Update timestamp
            localStorage.setItem('cozy_last_visit', now.toString());

            try {
                // Get IP info from free API
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();

                await supabase.from('visitor_logs').insert([{
                    ip: data.ip,
                    city: data.city,
                    country: data.country_name,
                    user_agent: navigator.userAgent,
                    path: location.pathname + location.hash
                }]);
            } catch (e) {
                // Fallback if API block: just log path
                await supabase.from('visitor_logs').insert([{
                    path: location.pathname + location.hash,
                    user_agent: navigator.userAgent
                }]);
            }
        };

        // Track only if throttle allows
        trackVisit();

        // Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', 'G-2CWSQZZ2EL', {
                page_path: location.pathname + location.hash
            });
        }
    }, [location.pathname]);

    return null;
};

export default Tracker;
