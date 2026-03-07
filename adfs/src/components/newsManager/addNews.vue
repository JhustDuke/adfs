<template>
	<div class="card shadow p-4">
		<h4 class="mb-3">Add News</h4>

		<form @submit.prevent="handleSubmit">
			<!-- TITLE -->
			<div class="mb-3">
				<label class="form-label">Title</label>
				<input
					v-model="form.title"
					class="form-control" />
				<small
					class="text-danger"
					v-if="errors.title"
					>{{ errors.title }}</small
				>
			</div>

			<!-- DATE -->
			<div class="mb-3">
				<label class="form-label">Date</label>
				<input
					v-model="form.date"
					type="date"
					class="form-control" />
				<small
					class="text-danger"
					v-if="errors.date"
					>{{ errors.date }}</small
				>
			</div>

			<!-- EXCERPT -->
			<div class="mb-3">
				<label class="form-label">Excerpt</label>
				<textarea
					v-model="form.excerpt"
					class="form-control"></textarea>
				<small
					class="text-danger"
					v-if="errors.excerpt"
					>{{ errors.excerpt }}</small
				>
			</div>

			<!-- FULL TEXT -->
			<div class="mb-3">
				<label class="form-label">Full Text</label>
				<textarea
					v-model="form.fullText"
					class="form-control"
					rows="5"></textarea>
				<small
					class="text-danger"
					v-if="errors.fullText"
					>{{ errors.fullText }}</small
				>
			</div>

			<!-- CATEGORY -->
			<div class="mb-3">
				<label class="form-label">Category</label>
				<input
					v-model="form.category"
					class="form-control" />
			</div>

			<!-- SUBMIT BUTTON -->
			<button
				class="btn btn-primary"
				:disabled="loading">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"
					role="status"></span>
				{{ loading ? "Adding..." : "Add News" }}
			</button>

			<!-- Simulated Error Message -->
			<div
				class="mt-2 text-danger"
				v-if="error"
				>{{ error }}</div
			>
		</form>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";
	import type { newsCardInterface } from "../../interfaces";

	const loading = ref(false);
	const error = ref("");

	// reactive form with explicit casting
	const form = reactive<newsCardInterface>({
		title: "",
		date: "",
		excerpt: "",
		fullText: "",
		category: "",
		bgColor: "",
		badgeColor: "",
	});

	const errors = reactive({
		title: "",
		date: "",
		excerpt: "",
		fullText: "",
	});

	const handleSubmit = function () {
		// reset errors
		errors.title = "";
		errors.date = "";
		errors.excerpt = "";
		errors.fullText = "";
		error.value = "";

		// cast values to string and validate
		form.title = String(form.title).trim();
		form.date = String(form.date).trim();
		form.excerpt = String(form.excerpt).trim();
		form.fullText = String(form.fullText).trim();
		form.category = String(form.category).trim();

		let valid = true;

		if (!form.title) {
			errors.title = "Title is required";
			valid = false;
		}
		if (!form.date) {
			errors.date = "Date is required";
			valid = false;
		}
		if (!form.excerpt) {
			errors.excerpt = "Excerpt is required";
			valid = false;
		}
		if (!form.fullText) {
			errors.fullText = "Full text is required";
			valid = false;
		}

		if (!valid) return;

		// simulate API call
		loading.value = true;

		setTimeout(function () {
			// 30% chance to simulate error
			if (Math.random() < 0.3) {
				loading.value = false;
				error.value = "Failed to add news. Please try again.";
				return;
			}

			console.log("News Added:", { ...form });

			// clear form
			form.title = "";
			form.date = "";
			form.excerpt = "";
			form.fullText = "";
			form.category = "";

			loading.value = false;

			// reload page to simulate refresh
			window.location.reload();
		}, 2000);
	};
</script>

<style scoped>
	/* optional styling */
</style>
