<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { Toaster } from 'svelte-french-toast'

	export let data

	$: ({ supabase, session } = data)

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => subscription.unsubscribe()
	})

	const handleSignOut = async () => {
		await supabase.auth.signOut()
	}
</script>

<Toaster />

<main class="container">
	<nav style:margin="2em auto">
		<a href="/">Home</a>
		{#if session}
			<button on:click={handleSignOut} style:width="6em">Logout</button>
		{/if}
	</nav>

	<slot />
</main>
