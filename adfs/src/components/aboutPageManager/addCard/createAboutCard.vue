<template>
	<div class="card shadow-sm border-0 p-3">
		<!-- HEADER -->
		<div class="d-flex justify-content-between align-items-center mb-3">
			<h5 class="blue-text text-darken-3 mb-0">Create About Card</h5>
		</div>

		<!-- ERROR -->
		<div
			v-if="error"
			class="red lighten-4 red-text text-darken-3 p-2 mb-3 rounded">
			{{ error }}
		</div>

		<!-- SUCCESS -->
		<div
			v-if="success"
			class="green lighten-4 green-text text-darken-3 p-2 mb-3 rounded">
			{{ success }}
		</div>

		<!-- TITLE -->
		<div class="mb-3">
			<label class="form-label text-muted">Title</label>
			<input
				v-model="form.title"
				class="form-control"
				placeholder="Enter title" />
		</div>

		<!-- TEXT -->
		<div class="mb-3">
			<label class="form-label text-muted">Content</label>
			<textarea
				v-model="form.textContent"
				class="form-control"
				rows="4"
				placeholder="Write content..."></textarea>
		</div>

		<!-- IMAGE -->
		<div class="mb-3">
			<label class="form-label text-muted">Image</label>

			<input
				type="file"
				class="form-control"
				@change="handleFile" />

			<p class="small text-muted mt-1 mb-0"> max 2mb file size </p>
		</div>

		<!-- ACTION -->
		<button
			class="btn btn-primary w-100"
			@click="openPreview"
			:disabled="loading || !form.title || !form.textContent">
			{{ loading ? "Preparing..." : "Open Preview" }}
		</button>

		<!-- MODAL -->
		<PreviewCard
			:show="showPreview"
			:title="form.title"
			:textContent="form.textContent"
			:imageSrc="imageUrl"
			:loading="loading"
			:errorMessage="error"
			:successMessage="success"
			@close="showPreview = false"
			@confirm="submit" />
	</div>
</template>
<script setup lang="ts">
	import { ref } from "vue";
	import PreviewCard from "./previewAboutCard.vue";

	const form = ref({
		title: "",
		textContent: "",
	});

	const imageUrl = ref("");
	const imageFile = ref<File | null>(null);

	const showPreview = ref(false);
	const loading = ref(false);
	const error = ref("");
	const success = ref("");

	function handleFile(e: Event): void {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			error.value = "File too large (max 2MB)";
			return;
		}

		error.value = "";
		imageFile.value = file;
		imageUrl.value = URL.createObjectURL(file);
	}

	function openPreview(): void {
		showPreview.value = true;
	}

	async function submit(): Promise<void> {
		loading.value = true;
		error.value = "";
		success.value = "";

		try {
			const formData = new FormData();

			formData.append("caption", form.value.title);
			formData.append("excerpts", form.value.textContent);

			if (imageFile.value) {
				formData.append("image", imageFile.value);
			}

			const res = await fetch("/api/about/createAboutCard", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const body = await res.json();
				throw new Error(body.message || "An error occurred");
			}

			success.value = "card created";
			form.value.title = "";
			form.value.textContent = "";
			imageFile.value = null;
			imageUrl.value = "";
			showPreview.value = false;

			setTimeout(function () {
				success.value = "";
				//window.location.reload();
			}, 6000);
		} catch (e: any) {
			error.value = e.message || "error creating card";
		} finally {
			loading.value = false;
		}
	}
</script>

<style scoped>
	.muted {
		font-size: 12px;
		color: #888;
	}
</style>
