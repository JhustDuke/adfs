<template>
	<div class="d-flex flex-column align-items-center py-5">
		<h3 class="mb-4">Delete News</h3>

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
			<p class="red-text text-darken-2 fw-bolder"> Unable to load news </p>
		</div>

		<!-- DATA -->
		<div
			v-else
			class="row g-4 w-100 justify-content-center">
			<div
				v-if="newsList.length === 0"
				class="text-muted text-center">
				No news available
			</div>

			<div
				v-for="(news, index) in newsList"
				:key="index"
				class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
				<div
					class="card shadow h-100"
					style="max-width: 350px; cursor: pointer"
					@click="confirmDelete(news.title)">
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
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import type { newsCardInterface } from "../../interfaces";

	const newsList = ref<newsCardInterface[]>([]);
	const isFetching = ref(true);
	const fetchError = ref(false);

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
		} finally {
			isFetching.value = false;
		}
	};

	onMounted(function () {
		fetchNews();
	});

	const confirmDelete = async function (title: string): Promise<void> {
		const ok = window.confirm(
			`Are you sure you want to delete news with this title:"${title}"?.THIS ACTION CANNOT BE UNDONE LATER!`
		);

		if (!ok) return;

		try {
			const res = await fetch("/api/news/deleteNews", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title }),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data?.error || "Delete failed");
				return;
			}

			// refresh UI
			window.location.reload();
		} catch (err) {
			alert("Network error");
		}
	};
</script>

<style scoped>
	.card:hover {
		transform: scale(1.02);
		transition: 0.2s;
	}
</style>
