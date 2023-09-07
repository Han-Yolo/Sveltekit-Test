<script lang="ts">
	import { enhance } from '$app/forms'

	export let form
</script>

<article>
	<header>
		<h1>Register</h1>
	</header>
	<form method="post" use:enhance>
		<label for="email">Email address</label>
		<input name="email" value={form?.email ?? ''} required />
		<label for="password">Password</label>
		<input type="password" name="password" required />
		<button>Register</button>
	</form>
</article>

<style>
	form {
		margin-bottom: 0;
	}

	form button {
		margin-bottom: 0;
	}
</style>
