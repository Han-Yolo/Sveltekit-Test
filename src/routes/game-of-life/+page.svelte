<script lang="ts">
	const HORIZONTAL_PIXELS = 10
	const VERTICAL_PIXELS = 5

	type Pixel = {
		alive: boolean
		futureAlive: boolean
	}

	let pixels: Pixel[][] = []
	for (let y = 0; y < VERTICAL_PIXELS; y++) {
		pixels[y] = []
		for (let x = 0; x < HORIZONTAL_PIXELS; x++) {
			pixels[y][x] = { alive: false, futureAlive: false }
		}
	}

	const onPixelClick = (y: number, x: number) => {
		pixels[y][x].alive = !pixels[y][x].alive
	}

	const isAlive = (y: number, x: number): boolean => {
		let alive = y >= 0 && y < VERTICAL_PIXELS && x >= 0 && x < HORIZONTAL_PIXELS
		if (alive) {
			alive = pixels[y][x].alive
		}
		return alive
	}

	const getAliveNeighbours = (y: number, x: number): number => {
		let aliveNeighbours = 0
		for (let yr = y - 1; yr <= y + 1; yr++) {
			for (let xr = x - 1; xr <= x + 1; xr++) {
				if (yr !== y && xr !== x) {
					if (isAlive(yr, xr)) {
						aliveNeighbours++
					}
				}
			}
		}
		return aliveNeighbours
	}

	const runCycle = () => {
		for (let y = 0; y < VERTICAL_PIXELS; y++) {
			for (let x = 0; x < HORIZONTAL_PIXELS; x++) {
				const aliveNeighbours = getAliveNeighbours(y, x)
				let current = pixels[y][x]
				if (current.alive) {
					current.futureAlive = aliveNeighbours === 2 || aliveNeighbours === 3
				} else {
					current.futureAlive = aliveNeighbours === 3
				}
			}
		}
		for (let y = 0; y < VERTICAL_PIXELS; y++) {
			for (let x = 0; x < HORIZONTAL_PIXELS; x++) {
				pixels[y][x].alive = pixels[y][x].futureAlive
			}
		}
	}
</script>

<div class="world" style="--HORIZONTAL_PIXELS:{HORIZONTAL_PIXELS}">
	{#each pixels as row, y}
		{#each row as pixel, x}
			<div on:click={() => onPixelClick(y, x)} class="cell {pixel.alive ? 'alive' : 'dead'}" />
		{/each}
	{/each}
</div>

<button on:click={runCycle} style="margin-top: 1em">Run Cycle</button>

<style>
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
