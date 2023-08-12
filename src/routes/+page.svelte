<script lang="ts">
	import type { Tables } from '../supabase'
	import { Toaster, toast } from 'svelte-french-toast'

	export let data

	$: ({ supabase, session } = data)
	// $: messages = data.messages ?? []
	let messages: Tables<'messages'>[] = []
	let newMessage = ''

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

	const addMessage = async () => {
		if (newMessage) {
			const { error } = await supabase.from('messages').insert({ content: newMessage })
			if (error) {
				console.log(error)
				toast.error('Could not add message')
			} else {
				toast.success('Message added')
			}
			loadMessages()
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

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			addMessage()
		}
	}

	$: if (session) {
		loadMessages()
	}
</script>

<Toaster />

<h1>Bonjour</h1>

{#if !data.session}
	<a href="/login" role="button" style="width: 100%; margin-bottom: 1em">Login</a>
	<a href="/register" role="button" style="width: 100%; margin-bottom: 1em">Register</a>
	<button on:click={handleGoogleSignIn}> Sign in with Google </button>
{:else}
	<h4>Here are your messages:</h4>
	{#if messages.length === 0}
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
							<button on:click={() => deleteMessage(message.id)} style="width: 3em; height: 3em">
								X
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div style="display: flex; justify-content: center; align-items: center; margin-top: 2em;">
			<input bind:value={newMessage} on:keydown={handleKeyDown} placeholder="New message" />
			<button on:click={addMessage} style="width: 7em; margin-left: 2em;">Add</button>
		</div>
	{/if}
{/if}
