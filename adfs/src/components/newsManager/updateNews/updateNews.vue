<template>
	<div class="d-flex flex-column align-items-center py-5">
		<h3 class="mb-4">Update News</h3>

		<!-- LOADING -->
		<div
			v-if="isFetching"
			class="text-center my-5">
			<div class="spinner-border text-primary"></div>
			<p class="mt-2 text-muted">Loading news...</p>
		</div>

		<!-- ERROR -->
		<div
			v-else-if="fetchError"
			class="text-center my-5">
			<p class="red-text text-darken-2 fw-bolder text-capitalize">
				Oops! , unable to fetch all news at the moment, for update, please try
				again later.
			</p>
		</div>

		<!-- DATA -->
		<div
			v-else
			class="row g-4 w-100 justify-content-center">
			<!-- EMPTY -->
			<div
				v-if="newsList.length === 0"
				class="text-muted text-center">
				No news updates
			</div>

			<div
				v-for="(news, index) in newsList"
				:key="index"
				class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
				<div
					class="card shadow h-100"
					style="max-width: 350px; cursor: pointer"
					@click="selectNews(news)">
					<div class="card-body">
						<h5>{{ news.title }}</h5>
						<small class="text-muted">{{ news.date }}</small>
						<p class="mt-2">{{ news.excerpt }}</p>

						<span
							v-if="news.category"
							:class="news.badgeColor || 'bg-primary'">
							{{ news.category }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<UpdateNewsModal
			:news="selectedNews"
			:showModal="showModal"
			:successMessage="successMessage"
			:errorMessage="errorMessage"
			:loading="isUpdating"
			@close="closeModal"
			@update="applyUpdate"
			@validationError="handleValidationError" />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import UpdateNewsModal from "./updateNewsModal.vue";
	import type { newsCardInterface } from "../../../interfaces";

	const newsList = ref<newsCardInterface[]>([]);

	const selectedNews = ref<newsCardInterface | null>(null);
	const showModal = ref(false);

	const isUpdating = ref(false);
	const isFetching = ref(true);
	const fetchError = ref(false);

	const successMessage = ref("");
	const errorMessage = ref("");

	const fetchNews = async function (): Promise<void> {
		try {
			isFetching.value = true;

			const res = await fetch("/api/news/getAllNews");
			const data = await res.json();
			if (!res.ok) {
				fetchError.value = true;
				return;
			}

			newsList.value = data || [];
		} catch {
			fetchError.value = true;
			console.log("fetch failed");
		} finally {
			isFetching.value = false;
		}
	};

	onMounted(function () {
		fetchNews();
	});

	const selectNews = function (news: newsCardInterface): void {
		selectedNews.value = news;
		showModal.value = true;
	};

	const closeModal = function (): void {
		showModal.value = false;
		selectedNews.value = null;

		successMessage.value = "";
		errorMessage.value = "";
		isUpdating.value = false;
	};

	const handleValidationError = function (message: string): void {
		errorMessage.value = message;
	};

	const applyUpdate = async function (updatedData: any): Promise<void> {
		try {
			if (!selectedNews.value) {
				console.log("no news selected");
				return;
			}

			isUpdating.value = true;
			errorMessage.value = "";
			successMessage.value = "";
			console.log(updatedData);

			const res = await fetch("/api/news/updateNews", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			});

			const data = await res.json();

			if (!res.ok) {
				errorMessage.value = data?.error || "Update failed";
				console.log("early return: update failed");
				isUpdating.value = false;
				return;
			}

			successMessage.value = "News updated successfully";

			selectedNews.value.title = updatedData.updatedTitle || updatedData.title;
			selectedNews.value.date = updatedData.date;
			selectedNews.value.excerpt = updatedData.excerpt;
			selectedNews.value.fullText = updatedData.fullText;
			selectedNews.value.category = updatedData.category;

			isUpdating.value = false;

			setTimeout(function () {
				closeModal();
				window.location.reload();
			}, 3000);
		} catch (err: any) {
			errorMessage.value = err?.message || "Network error";
			isUpdating.value = false;
		}
	};
</script>

<style scoped>
	.card:hover {
		transform: scale(1.02);
		transition: 0.2s;
	}
</style>
