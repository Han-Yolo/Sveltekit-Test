<script lang="ts">
	import type { SubmitFunction } from './$types.js'
	import type { Tables } from '../supabase'
	import { enhance } from '$app/forms'
	import { toast } from 'svelte-french-toast'

	export let data
	export let form

	$: if (form?.failure) {
		toast.error(form.failure ?? 'Could not add message')
	}

	$: ({ supabase, session } = data)
	// $: messages = data.messages ?? []
	let messages: Tables<'messages'>[] | null = null

	const handleGoogleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google'
		})
	}

	const loadMessages = async () => {
		const { data, error } = await supabase
			.from('messages')
			.select('*')
			.eq('user_id', session?.user.id)

		if (error) {
			console.log('Getting messages failed')
		}
		if (data) {
			messages = data
		}
	}

	const deleteMessage = async (id: number) => {
		const { error } = await supabase.from('messages').delete().eq('id', id)
		if (error) {
			console.log(error)
			toast.error('Could not delete message')
		} else {
			toast.success('Message deleted', {
				icon: '🔥'
			})
		}
		loadMessages()
	}

	const addEnhance: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success('Message added')
			}
			update()
		}
	}

	$: if (session) {
		loadMessages()
	}
</script>

<article>
	<header>
		<h1>Bonjour</h1>
	</header>

	{#if !data.session}
		<a href="/login" role="button" class="link_button">Login</a>
		<a href="/register" role="button" class="link_button">Register</a>
		<button on:click={handleGoogleSignIn} class="bottom_element"> Sign in with Google </button>
	{:else}
		<h4>Here are your messages:</h4>
		{#if messages === null}
			<article aria-busy="true" />
		{:else}
			<table>
				<thead>
					<tr>
						<th scope="col">Content</th>
						<th scope="col">Creation Date</th>
						<th scope="col">Delete</th>
					</tr>
				</thead>
				<tbody>
					{#each messages as message}
						<tr>
							<td> {message.content} </td>
							<td> {new Date(message.created_at).toLocaleString('de-DE')} </td>
							<td>
								<button on:click={() => deleteMessage(message.id)} class="delete_button">
									X
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<form method="POST" action="?/add" use:enhance={addEnhance} class="add_form">
				<input name="message" placeholder="New message" class="bottom_element" />
				<button class="bottom_element">Add</button>
			</form>
		{/if}
	{/if}
</article>

<style>
	.link_button {
		width: 100%;
		margin-bottom: 1em;
	}

	.delete_button {
		width: 3em;
		height: 3em;
	}

	.add_form {
		display: flex;
		gap: 2em;
		justify-content: center;
		align-items: center;
		margin-top: 2em;
		margin-bottom: 0;
	}

	.add_form button {
		width: 7em;
	}

	.bottom_element {
		margin-bottom: 0;
	}
</style>
