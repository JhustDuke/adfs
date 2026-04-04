<template>
	<div
		v-if="showModal"
		class="custom-modal">
		<!-- backdrop -->
		<div
			class="custom-modal-backdrop"
			@click="closeModal"></div>

		<!-- modal content -->
		<div class="custom-modal-content">
			<div class="d-flex justify-content-between mb-3">
				<h5>Update News</h5>

				<button
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<div
				v-if="errorMessage"
				class="alert alert-danger">
				{{ errorMessage }}
			</div>

			<input
				class="form-control mb-3"
				v-model="form.title"
				placeholder="Title" />

			<input
				class="form-control mb-3"
				v-model="form.date"
				placeholder="Date" />

			<input
				class="form-control mb-3"
				v-model="form.category"
				placeholder="Category" />

			<textarea
				class="form-control mb-3"
				rows="2"
				v-model="form.excerpt"
				placeholder="Excerpt"></textarea>

			<textarea
				class="form-control mb-3"
				rows="5"
				v-model="form.fullText"
				placeholder="Full Text"></textarea>

			<button
				class="btn btn-primary"
				@click="updateNews"
				:disabled="loading">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"></span>

				Update
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, watch } from "vue";
	import type { newsCardInterface } from "../../interfaces";

	const props = defineProps<{
		news: newsCardInterface | null;
		showModal: boolean;
	}>();

	const emit = defineEmits(["close", "update"]);

	const form = reactive<any>({
		title: "",
		date: "",
		excerpt: "",
		fullText: "",
		category: "",
	});

	const loading = ref<boolean>(false);
	const errorMessage = ref<string>("");

	/**
	 * populate form when news changes
	 */
	watch(
		() => props.news,
		function (news) {
			if (!news) {
				return;
			}

			form.title = String(news.title);
			form.date = String(news.date);
			form.excerpt = String(news.excerpt);
			form.fullText = String(news.fullText);
			form.category = String(news.category || "");
		},
		{ immediate: true }
	);

	/**
	 * close modal
	 */
	const closeModal = function (): void {
		emit("close");
	};

	/**
	 * update news
	 */
	const updateNews = function (): void {
		errorMessage.value = "";

		const title = String(form.title).trim();
		const date = String(form.date).trim();
		const excerpt = String(form.excerpt).trim();
		const fullText = String(form.fullText).trim();

		if (!title || !date || !excerpt || !fullText) {
			errorMessage.value = "All required fields must be filled.";
			return;
		}

		loading.value = true;

		setTimeout(function () {
			emit("update", {
				title: title,
				date: date,
				excerpt: excerpt,
				fullText: fullText,
				category: form.category,
			});

			loading.value = false;
		}, 1500);
	};
</script>

<style scoped>
	.custom-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.custom-modal-backdrop {
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	.custom-modal-content {
		position: relative;
		background: white;
		padding: 2rem;
		border-radius: 8px;
		width: 90%;
		max-width: 600px;
		z-index: 2001;
	}
</style>
