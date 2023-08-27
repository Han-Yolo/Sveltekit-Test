import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

export const actions: Actions = {
	add: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData()
		const message = formData.get('message') as string
		if (message.trim().length === 0) {
			return fail(400, {
				failure: 'Message can not be empty'
			})
		}
		const { error } = await supabase.from('messages').insert({ content: message })
		if (error) {
			return fail(500, { failure: 'Database error' })
		}
	}
}
