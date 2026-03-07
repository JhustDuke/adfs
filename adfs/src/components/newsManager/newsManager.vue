<template>
	<!-- NEWS MANAGEMENT -->

	<div>
		<h4 class="mb-4">News Manager</h4>

		<!-- ACTION BAR -->
		<div class="mb-3">
			<button
				class="btn green darken-2 white-text me-2"
				@click="setMode('create')">
				Add News
			</button>

			<button
				class="btn blue darken-2 white-text"
				@click="setMode('list')">
				View All
			</button>
		</div>

		<!-- CREATE MODE -->
		<div v-if="mode === 'create'">
			<h5>Create News</h5>
		</div>

		<!-- LIST MODE -->
		<div v-if="mode === 'list'">
			<table class="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Date</th>
						<th>Control</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td>Example News</td>
						<td>March 2026</td>

						<td>
							<button
								class="btn blue"
								@click="setMode('edit')">
								Edit
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue";

	const mode = ref("list");

	/* =========================================================
MODE SWITCHER
========================================================= */

	const setMode = function (newMode) {
		mode.value = newMode;
	};
</script>
