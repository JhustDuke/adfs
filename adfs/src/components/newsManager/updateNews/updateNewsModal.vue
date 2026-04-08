<template>
	<div
		v-if="showModal"
		class="custom-modal">
		<!-- backdrop -->
		<div
			class="custom-modal-backdrop"
			@click="closeModal"></div>

		<!-- modal content -->
		<div class="custom-modal-content z-depth-3">
			<div class="d-flex justify-content-between mb-3">
				<h5 class="blue-text text-darken-3">Update News</h5>

				<button
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<!-- ERROR -->
			<div
				v-if="errorMessage"
				class="red lighten-4 red-text text-darken-3 p-2 mb-3 rounded">
				{{ errorMessage }}
			</div>

			<!-- SUCCESS -->
			<div
				v-if="successMessage"
				class="green lighten-4 green-text text-darken-3 p-2 mb-3 rounded">
				{{ successMessage }}
			</div>

			<!-- category -->
			<input
				class="form-control mb-3"
				v-model="formFields.category"
				placeholder="Category" />

			<!-- title -->
			<input
				class="form-control mb-3"
				v-model="formFields.title"
				placeholder="Title" />

			<!-- excerpt -->
			<textarea
				class="form-control mb-3"
				v-model="formFields.excerpt"
				placeholder="Excerpt"></textarea>

			<!-- fulltxt -->
			<textarea
				class="form-control mb-3"
				v-model="formFields.fullText"
				placeholder="Full Text"></textarea>

			<!-- date -->
			<input
				class="form-control mb-3"
				v-model="formFields.date"
				placeholder="Date" />

			<!-- SUBMIT -->
			<button
				class="btn btn-primary"
				@click="submitUpdate"
				:disabled="loading">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"></span>

				{{ loading ? "Loading..." : "Update" }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, watch, ref } from "vue";
	import type { newsCardInterface } from "../../../interfaces";
	import { validateFields } from "../../../utils";

	const props = defineProps<{
		news: newsCardInterface | null;
		showModal: boolean;
		successMessage: string;
		errorMessage: string;
		loading: boolean;
	}>();

	const emit = defineEmits(["close", "update", "validationError"]);

	const formFields = reactive({
		title: "",
		date: "",
		excerpt: "",
		fullText: "",
		category: "",
	});

	const initialTitle = ref<string>("");

	watch(
		function () {
			return props.news;
		},
		function (news) {
			if (!news) return;

			formFields.title = String(news.title).trim().toLowerCase();
			formFields.date = String(news.date);
			formFields.excerpt = String(news.excerpt);
			formFields.fullText = String(news.fullText);
			formFields.category = String(news.category || "");

			initialTitle.value = String(news.title).trim().toLowerCase();
		},
		{ immediate: true }
	);

	const closeModal = function (): void {
		emit("close");
	};

	const submitUpdate = function (): void {
		const payload: Record<string, string> = {
			initialTitle: initialTitle.value,
			title: String(formFields.title).trim().toLowerCase(),
			date: String(formFields.date).trim(),
			excerpt: String(formFields.excerpt).trim(),
			fullText: String(formFields.fullText).trim(),
			category: String(formFields.category).trim().toLowerCase(),
		};

		try {
			const requiredFields: string[] = [
				"initialTitle",
				"date",
				"excerpt",
				"fullText",
				"category",
			];

			if (payload.title !== initialTitle.value) {
				requiredFields.push("title");
			}

			const validated = validateFields(
				payload,
				requiredFields,
				"incomplete fields"
			);

			if (payload.title !== initialTitle.value) {
				emit("update", {
					initialTitle: validated.initialTitle,
					updatedTitle: validated.title,
					date: validated.date,
					excerpt: validated.excerpt,
					fullText: validated.fullText,
					category: validated.category,
				});
				return;
			}

			emit("update", {
				initialTitle: validated.initialTitle,
				date: validated.date,
				excerpt: validated.excerpt,
				fullText: validated.fullText,
				category: validated.category,
			});
		} catch (error: any) {
			console.log("early return: validation failed");
			emit("validationError", error.message);
			return;
		}
	};
</script>

<style scoped>
	.custom-modal {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
	}

	.custom-modal-backdrop {
		position: absolute;
		inset: 0;
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
