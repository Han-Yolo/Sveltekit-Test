<script lang="ts">
	export let data
</script>

<h1>Bonjour</h1>

{#if !data.session}
	<a href="/login" role="button" style="width: 100%; margin-bottom: 1em">Login</a>
	<a href="/register" role="button" style="width: 100%; margin-bottom: 1em">Register</a>
	<button> Sign in with Google </button>
{:else}
	<p>You are logged in!</p>
{/if}
