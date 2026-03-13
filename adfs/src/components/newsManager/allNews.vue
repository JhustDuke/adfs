<template>
	<div class="d-flex flex-column align-items-center py-5">
		<h3 class="mb-4">All News</h3>

		<div class="row g-4 w-100">
			<div
				v-for="item in newsList"
				:key="item.title + item.date"
				class="col-12 col-md-6 col-lg-4">
				<NewsCard :news="item" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import NewsCard from "./newsModals.vue";
	import type { newsCardInterface } from "../../interfaces";

	const newsList = ref<newsCardInterface[]>([
		{
			title: "Breaking News",
			date: "2026-03-07",
			excerpt: "Short preview...",
			fullText: "Full detailed news content appears here.",
			category: "General",
			badgeColor: "bg-success",
		},
		{
			title: "Breaking News",
			date: "2026-03-07",
			excerpt: "Short preview...",
			fullText: "Full detailed news content appears here.",
			category: "General",
			badgeColor: "bg-success",
		},
		{
			title: "Breaking News",
			date: "2026-03-07",
			excerpt: "Short preview...",
			fullText: "Full detailed news content appears here.",
			category: "General",
			badgeColor: "bg-success",
		},
		{
			title: "Breaking News",
			date: "2026-03-07",
			excerpt: "Short preview...",
			fullText: "Full detailed news content appears here.",
			category: "General",
			badgeColor: "bg-success",
		},
	]);
</script>
