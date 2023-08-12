// import type { PageLoad } from './$types'
// import { fail } from '@sveltejs/kit'

// export const load: PageLoad = async ({ parent }) => {
// 	const { supabase, session } = await parent()

// 	if (session) {
// 		const { data, error } = await supabase
// 			.from('messages')
// 			.select('id, created_at, content')
// 			.eq('user_id', session?.user.id)

// 		if (error) {
// 			console.log(error)
// 			return fail(500, {
// 				error: 'Server error. Try again later.'
// 			})
// 		}
// 		return { messages: data }
// 	}
// }
