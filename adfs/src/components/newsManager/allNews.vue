<template>
	<div class="d-flex flex-column align-items-center py-5">
		<h3 class="mb-4">All News</h3>

		<!-- LOADING -->
		<div
			v-if="loading"
			class="text-center my-5">
			<div class="spinner-border text-primary"></div>
			<p class="mt-2 text-muted">Loading news...</p>
		</div>

		<!-- ERROR -->
		<div
			v-else-if="error"
			class="text-danger mt-3 text-center">
			{{ error }}
		</div>

		<!-- EMPTY STATE -->
		<div
			v-else-if="newsList.length === 0"
			class="text-muted">
			No news update
		</div>

		<!-- DATA -->
		<div
			v-else
			class="row g-4 w-100">
			<div
				v-for="item in newsList"
				:key="item.title + item.date"
				class="col-12 col-md-6 col-lg-4">
				<NewsCard
					:news="item"
					:badgeColor="getBadgeColor(item.category as string)" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import NewsCard from "./newsModals.vue";
	import type { newsCardInterface } from "../../interfaces";

	const newsList = ref<newsCardInterface[]>([]);
	const loading = ref(false);
	const error = ref("");

	function getBadgeColor(category: string): string {
		const value = (category || "").toLowerCase();

		if (value === "urgent") return "red lighten-3";
		if (value === "announcement") return "blue lighten-3";
		if (value === "event") return "green lighten-3";
		if (value === "academic") return "indigo lighten-3";
		if (value === "sports") return "teal lighten-3";
		if (value === "holiday") return "orange lighten-3";

		return "grey lighten-2";
	}

	async function fetchNews(): Promise<void> {
		loading.value = true;
		error.value = "";

		try {
			const res = await fetch("/api/news/getAllNews");
			const data = await res.json();

			if (!res.ok) {
				error.value = data?.error || "Failed to load news";
				return;
			}

			newsList.value = Array.isArray(data) ? data : [];
		} catch (err: any) {
			error.value = err?.message || "Network error";
		} finally {
			loading.value = false;
		}
	}

	onMounted(function () {
		fetchNews();
	});
</script>
