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
	<nav>
		<ul class="nav-left">
			<li><a href="/">Home</a></li>
			<li><a href="/game-of-life">Game of Life</a></li>
		</ul>
		<ul class="nav-right">
			<li>
				{#if session}
					<button on:click={handleSignOut}>Logout</button>
				{/if}
			</li>
		</ul>
	</nav>

	<slot />
</main>

<style>
	nav {
		margin: 2em 0;
	}

	nav li {
		padding-top: 0;
		padding-bottom: 0;
	}

	nav a {
		margin-right: 2em;
	}

	.nav-left li {
		float: left;
	}

	.nav-right li {
		float: right;
	}

	nav button {
		width: 6em;
		height: 2.5em;
		padding: 0;
	}
</style>
