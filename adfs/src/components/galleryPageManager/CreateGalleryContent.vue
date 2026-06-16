<template>
	<div class="p-2">
		<h5 class="mb-3 fw-semibold">Create New Gallery</h5>

		<!-- ================= ERROR ================= -->
		<div
			v-if="error"
			class="alert alert-danger py-2 small">
			{{ error }}
		</div>

		<!-- ================= SUCCESS ================= -->
		<div
			v-if="success"
			class="alert alert-success py-2 small">
			Gallery created successfully!
		</div>

		<GalleryForm
			submit-label="Create Gallery"
			:is-loading="isLoading"
			:is-done="success"
			@submit="submit" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import GalleryForm from "./GalleryForm.vue";
	import { type ImageInterface } from "./types";

	/* ================= EMITS ================= */
	const emit = defineEmits<{
		(e: "created"): void;
	}>();

	/* ================= STATE ================= */
	const error = ref<string>("");
	const success = ref<boolean>(false);
	const isLoading = ref<boolean>(false);

	/* ================= SUBMIT ================= */
	async function submit(payload: {
		caption: string;
		month: string;
		year: number;
		images: ImageInterface[];
	}): Promise<void> {
		error.value = "";
		success.value = false;
		isLoading.value = true;

		try {
			const formData = new FormData();

			formData.append("caption", payload.caption);
			formData.append("month", payload.month);
			formData.append("year", String(payload.year));

			payload.images.forEach(function (img, i) {
				if (img.file) {
					formData.append("images", img.file);
				}

				formData.append(`subcaption_${i}`, img.subCaption || "");
			});

			const res = await fetch("/api/gallery/createGallery", {
				method: "POST",
				body: formData,
				headers: {
					Origin: window.location.origin,
					"X-Requested-With": "XMLHttpRequest",
				},
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message);
			}

			success.value = true;

			setTimeout(function () {
				emit("created");
			}, 3000);
		} catch (err: unknown) {
			error.value =
				err instanceof Error ? err.message : "Failed to create gallery";
		} finally {
			isLoading.value = false;
		}
	}
</script>
