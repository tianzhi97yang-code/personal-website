
import { createClient } from '@supabase/supabase-js';

// Replace with your actual project URL and Anon Key
const supabaseUrl = 'https://oraoxngkqiaxebkczmpk.supabase.co';
const supabaseKey = 'sb_publishable_zvXeCdOqJk_sPE4WuRgcXw_lP3CQkok'; // User provided key

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to verify admin password
export async function verifyAdminPassword(password: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('admin_credentials')
            .select('password')
            .eq('username', 'admin')
            .single();

        if (error || !data) {
            console.error('Error verifying admin password:', error);
            return false;
        }

        return data.password === password;
    } catch (err) {
        console.error('Exception verifying admin password:', err);
        return false;
    }
}

