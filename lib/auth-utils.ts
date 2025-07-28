import { createClient } from '@/lib/supabase/server';

export const getSession = async () => {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
};

export const getUser = async () => {
	const session = await getSession();
	return session?.user;
};
