<script lang="ts">
	import toast from 'svelte-french-toast'

	export let data

	$: ({ supabase, session } = data)

	let horizontalPixels = 30
	let verticalPixels = 15
	let totalPixels = 0
	let loadFlag = false // Used to keep initPixels() from overwriting the pixels after they were loaded from storage.
	$: {
		totalPixels = horizontalPixels * verticalPixels
		if (!loadFlag) {
			initPixels()
		}
		loadFlag = false
	}

	let cycleIntervalId: number = 0

	let pixels: boolean[]

	const initPixels = () => {
		pixels = new Array(totalPixels).fill(false)
	}

	const getIndex = (x: number, y: number): number => {
		return y * horizontalPixels + x
	}

	const getCoordinates = (i: number): { x: number; y: number } => {
		return { x: i % horizontalPixels, y: Math.trunc(i / horizontalPixels) }
	}

	const isAlive = (x: number, y: number): boolean => {
		let alive = y >= 0 && y < verticalPixels && x >= 0 && x < horizontalPixels
		if (alive) {
			alive = pixels[getIndex(x, y)]
		}
		return alive
	}

	const getAliveNeighbours = (y: number, x: number): number => {
		let aliveNeighbours = 0
		for (let xr = x - 1; xr <= x + 1; xr++) {
			for (let yr = y - 1; yr <= y + 1; yr++) {
				if (yr !== y || xr !== x) {
					if (isAlive(xr, yr)) {
						aliveNeighbours++
					}
				}
			}
		}
		return aliveNeighbours
	}

	const runCycle = () => {
		let futurePixels: boolean[] = new Array(totalPixels)
		pixels.forEach((pixel, i) => {
			const { x, y } = getCoordinates(i)
			const aliveNeighbours = getAliveNeighbours(y, x)
			if (pixel) {
				futurePixels[i] = aliveNeighbours === 2 || aliveNeighbours === 3
			} else {
				futurePixels[i] = aliveNeighbours === 3
			}
		})
		pixels = futurePixels
	}

	const onPixelClick = (i: number) => {
		pixels[i] = !pixels[i]
	}

	const saveWorld = async () => {
		const { error } = await supabase.from('game_of_life').upsert(
			{
				save_state: pixels,
				horizontal_world_size: horizontalPixels,
				vertical_world_size: verticalPixels
			},
			{ onConflict: 'user_id', ignoreDuplicates: false }
		)
		if (error) {
			toast.error('Could not save world')
		} else {
			toast.success('World saved')
		}
	}

	const loadWorld = async () => {
		const { data, error } = await supabase
			.from('game_of_life')
			.select('save_state, horizontal_world_size, vertical_world_size')
			.eq('user_id', session?.user.id)
			.limit(1)
			.single()
		if (error) {
			toast.error('Could not load world')
		}
		if (data) {
			horizontalPixels = data.horizontal_world_size
			verticalPixels = data.vertical_world_size
			pixels = data.save_state
			loadFlag = true
			toast.success('World loaded')
		}
	}
</script>

<article>
	<header>
		<div class="controll">
			<div class="controll">
				<label for="horizontal">Horizontal</label>
				<input bind:value={horizontalPixels} type="range" name="horizontal" min="1" max="100" />
			</div>
			<div class="controll">
				<label for="vertical">Vertical</label>
				<input bind:value={verticalPixels} type="range" name="vertical" min="1" max="100" />
			</div>
		</div>
		<div class="controll">
			{#if !cycleIntervalId}
				<button on:click={() => (cycleIntervalId = window.setInterval(runCycle, 100))}>Run</button>
			{:else}
				<button
					on:click={() => {
						window.clearInterval(cycleIntervalId)
						cycleIntervalId = 0
					}}>Pause</button
				>
			{/if}
			<button on:click={initPixels}>Reset</button>
			<button
				on:click={saveWorld}
				disabled={!session}
				data-tooltip={session ? null : 'Login to save'}>Save</button
			>
			<button
				on:click={loadWorld}
				disabled={!session}
				data-tooltip={session ? null : 'Login to load'}>Load</button
			>
		</div>
	</header>

	<div class="world" style="--HORIZONTAL_PIXELS:{horizontalPixels}">
		{#each pixels as pixel, i}
			<div on:click={() => onPixelClick(i)} class="cell {pixel ? 'alive' : 'dead'}" />
		{/each}
	</div>
</article>

<style>
	.controll {
		display: flex;
		flex: 1 1 0px;
		gap: 1em;
	}
	.controll button {
		pointer-events: auto;
		margin-bottom: 0;
	}
	.world {
		display: grid;
		grid-template-columns: repeat(var(--HORIZONTAL_PIXELS), 1fr);
		gap: 1px;
	}
	.cell {
		aspect-ratio: 1 / 1;
	}
	.alive {
		background-color: #fff;
	}
	.dead {
		background-color: #000;
	}
</style>
