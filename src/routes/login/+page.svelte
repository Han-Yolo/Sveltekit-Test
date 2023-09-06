<script lang="ts">
	import type { SubmitFunction } from './$types.js'
	import { enhance } from '$app/forms'
	import { toast } from 'svelte-french-toast'

	export let form

	let password = ''

	const loginEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			password = ''
			if (result.type === 'failure') {
				toast.error('Login failed')
			}
			update()
		}
	}
</script>

<h1>Login</h1>
<form action="?/login" method="post" use:enhance={loginEnhance}>
	<label for="email">Email address</label>
	<input name="email" value={form?.values.email ?? ''} required />
	<label for="password">Password</label>
	<input type="password" name="password" bind:value={password} required />
	<button>Login</button>
</form>
