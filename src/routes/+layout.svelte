<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { Toaster } from 'svelte-french-toast'

	import '../app.css'

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
	<nav>
		<div class="nav-left">
			<a href="/">Home</a>
			<a href="/game-of-life">Game of Life</a>
		</div>
		<div class="nav-right">
			<button on:click={handleSignOut} style:visibility={session ? 'visible' : 'hidden'}
				>Logout</button
			>
		</div>
	</nav>

	<slot />
</main>

<style>
	nav {
		margin: 2em 0;
	}

	.nav-left {
		float: left;
		display: flex;
		gap: 2em;
		padding-top: 0.5em;
	}

	.nav-right {
		float: right;
		display: flex;
		gap: 2em;
	}

	nav button {
		width: 6em;
		height: 2.5em;
		padding: 0;
		margin: 0;
	}
</style>
