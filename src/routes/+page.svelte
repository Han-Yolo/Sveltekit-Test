<script lang="ts">
	export let data

	$: ({ supabase, session } = data)

	const handleGoogleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google'
		})
	}

	let messages: { id: number; created_at: string; content: string }[] = []
	async function loadMessages() {
		const { data, error } = await supabase
			.from('messages')
			.select('id, created_at, content')
			.eq('user_id', session?.user.id)

		if (error) {
			console.log('Getting messages failed')
		}
		if (data) {
			messages = data
		}
	}

	$: if (session) {
		loadMessages()
	}
</script>

<h1>Bonjour</h1>

{#if !data.session}
	<a href="/login" role="button" style="width: 100%; margin-bottom: 1em">Login</a>
	<a href="/register" role="button" style="width: 100%; margin-bottom: 1em">Register</a>
	<button on:click={handleGoogleSignIn}> Sign in with Google </button>
{:else}
	<h3>You are logged in!</h3>
	<h5>Here are your messages:</h5>
	<table>
		<thead>
			<tr>
				<th scope="col">Id</th>
				<th scope="col">Content</th>
				<th scope="col">Creation Date</th>
			</tr>
		</thead>
		<tbody>
			{#each messages as message}
				<tr>
					<th scope="row"> {message.id} </th>
					<td> {message.content} </td>
					<td> {new Date(message.created_at).toLocaleString('de-DE')} </td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
