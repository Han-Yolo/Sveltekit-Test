<script lang="ts">
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from './$types.js'

	export let form

	let password = ''

	const formEnhancement: SubmitFunction = ({}) => {
		return async ({ result, update }) => {
			password = ''
			update()
		}
	}
</script>

<h1>Login</h1>
<form action="?/login" method="post" use:enhance={formEnhancement}>
	<label for="email">Email address</label>
	<input name="email" value={form?.values.email ?? ''} required />
	<label for="password">Password</label>
	<input type="password" name="password" bind:value={password} required />
	<button>Login</button>
</form>
