<script lang="ts">
	import toast from 'svelte-french-toast'

	import type { World } from './worlds'
	import { pulsar } from './worlds'

	export let data

	$: ({ supabase, session } = data)

	let pixels: boolean[]
	let horizontalPixels: number
	let verticalPixels: number
	let totalPixels: number

	let speed_1_s = 7
	let running = false

	let newWorldFlag = false // Used to keep initPixels() from overwriting the pixels after they were set to a new world.
	$: {
		totalPixels = horizontalPixels * verticalPixels
		if (!newWorldFlag) {
			initPixels()
		}
		newWorldFlag = false
	}

	const initPixels = () => {
		pixels = new Array(totalPixels).fill(false)
	}

	const setWorld = (world: World) => {
		pixels = world.pixels
		horizontalPixels = world.horizontalPixels
		verticalPixels = world.verticalPixels
		newWorldFlag = true
	}
	setWorld(pulsar)

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
		if (running) {
			setTimeout(runCycle, 1000 / speed_1_s)
		}

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
		if (!session) {
			return
		}
		const { data, error } = await supabase
			.from('game_of_life')
			.select('save_state, horizontal_world_size, vertical_world_size')
			.eq('user_id', session.user.id)
			.limit(1)
			.single()
		if (error) {
			toast.error('Could not load world')
		}
		if (data) {
			setWorld({
				pixels: data.save_state,
				horizontalPixels: data.horizontal_world_size,
				verticalPixels: data.vertical_world_size
			})
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
			{#if !running}
				<button
					on:click={() => {
						running = true
						runCycle()
					}}>Run</button
				>
			{:else}
				<button
					on:click={() => {
						running = false
					}}>Pause</button
				>
			{/if}
			<button on:click={initPixels}>Reset</button>
			<button
				on:click={saveWorld}
				disabled={!session}
				data-tooltip={session ? null : 'Login to save'}
				data-placement="bottom">Save</button
			>
			<button
				on:click={loadWorld}
				disabled={!session}
				data-tooltip={session ? null : 'Login to load'}
				data-placement="bottom">Load</button
			>
		</div>
		<div class="controll">
			<label for="speed" class="controll_bottom">Speed</label>
			<input
				bind:value={speed_1_s}
				type="range"
				name="speed"
				min="1"
				max="20"
				class="controll_bottom"
			/>
		</div>
	</header>

	<div class="world" style="--HORIZONTAL_PIXELS:{horizontalPixels}">
		{#each pixels as pixel, i}
			<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
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
	}

	.controll_bottom {
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
