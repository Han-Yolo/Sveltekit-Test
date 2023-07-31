<script lang="ts">
	import { enhance } from '$app/forms'

	export let form
</script>

<h1>Register</h1>
<form method="post" use:enhance>
	<label for="email">Email address</label>
	<input name="email" value={form?.email ?? ''} required />
	<label for="password">Password</label>
	<input type="password" name="password" required />
	<button>Register</button>
</form>
