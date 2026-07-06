<template>
	<button
		class="btn btn-dark rounded-circle shadow"
		style="
			position: fixed;
			bottom: 20px;
			right: 20px;

			height: 56px;
			z-index: 1050;
		"
		@click="openAnalytics">
		Analystics
	</button>

	<div
		v-if="isOpen"
		style="
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			z-index: 1060;
			display: flex;
			align-items: center;
			justify-content: center;
		"
		@click.self="closeAnalytics">
		<div
			class="bg-white rounded shadow"
			style="width: 90%; max-width: 800px; max-height: 80vh; overflow-y: auto">
			<div
				class="d-flex justify-content-between align-items-center p-3 border-bottom">
				<h5 class="m-0">Site Analytics</h5>
				<button
					type="button"
					class="btn-close"
					@click="closeAnalytics"></button>
			</div>

			<div class="p-3">
				<div
					v-if="loading"
					class="text-center text-muted"
					>Loading...</div
				>
				<div
					v-else-if="error"
					class="text-center text-danger"
					>{{ error }}</div
				>
				<table
					v-else
					class="table table-sm table-striped">
					<thead>
						<tr>
							<th>IP</th>
							<th>Page</th>
							<th>Date</th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="row in analytics"
							:key="row.id">
							<td>{{ row.ip }}</td>
							<td>{{ row.page }}</td>
							<td>{{ row.visited_date }}</td>
							<td>{{ row.visited_time }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	const analytics = ref<any[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const isOpen = ref(false);

	async function openAnalytics() {
		isOpen.value = true;
		loading.value = true;
		error.value = null;

		try {
			const res = await fetch("/api/analytics");
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "failed to load analytics");
			}

			analytics.value = data.data;
		} catch (err: any) {
			error.value = err.message || "failed to load analytics";
			analytics.value = [];
		} finally {
			loading.value = false;
		}
	}

	function closeAnalytics() {
		isOpen.value = false;
	}
</script>
