<template>
	<div class="d-flex flex-column align-items-center py-5">
		<h3 class="mb-4">Update News</h3>

		<div class="row g-4 w-100 justify-content-center">
			<div
				v-for="(news, index) in newsList"
				:key="index"
				class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
				<div
					class="card shadow h-100"
					style="max-width: 350px; cursor: pointer"
					@click="selectNews(news)">
					<div class="card-body">
						<h5 class="card-title">
							{{ news.title }}
						</h5>

						<small class="text-muted">
							{{ news.date }}
						</small>

						<p class="mt-2">
							{{ news.excerpt }}
						</p>

						<span
							v-if="news.category"
							class="badge"
							:class="news.badgeColor || 'bg-primary'">
							{{ news.category }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- UPDATE MODAL -->

		<UpdateNewsModal
			:news="selectedNews"
			:showModal="showModal"
			@close="closeModal"
			@update="applyUpdate" />
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import UpdateNewsModal from "./updateNewsModal.vue";
	import type { newsCardInterface } from "../../interfaces";

	const newsList = reactive<newsCardInterface[]>([
		{
			title: "School Resumption",
			date: "2026-03-10",
			excerpt: "School resumes next week.",
			fullText: "All students must resume Monday.",
			category: "Announcement",
		},
	]);

	const selectedNews = ref<newsCardInterface | null>(null);
	const showModal = ref<boolean>(false);

	/**
	 * selects the news item and opens modal
	 */
	const selectNews = function (news: newsCardInterface): void {
		selectedNews.value = news;
		showModal.value = true;
	};

	/**
	 * closes modal
	 */
	const closeModal = function (): void {
		showModal.value = false;
		selectedNews.value = null;
	};

	/**
	 * applies update from modal
	 */
	const applyUpdate = function (updatedData: any): void {
		if (!selectedNews.value) {
			console.log("no news selected");
			return;
		}

		selectedNews.value.title = updatedData.title;
		selectedNews.value.date = updatedData.date;
		selectedNews.value.excerpt = updatedData.excerpt;
		selectedNews.value.fullText = updatedData.fullText;
		selectedNews.value.category = updatedData.category;

		showModal.value = false;
	};
</script>

<style scoped>
	.card:hover {
		transform: scale(1.02);
		transition: 0.2s;
	}
</style>
