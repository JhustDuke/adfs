<template>
	<div class="p-3">
		<!-- ================= ERROR ================= -->
		<div
			v-if="error"
			class="alert alert-danger py-2 small mb-3">
			{{ error }}
		</div>

		<!-- ================= GALLERIES ================= -->
		<div
			v-for="gallery in galleries"
			:key="gallery.galleryDB_id"
			class="mb-4 border rounded p-2">
			<!-- ========== CAPTION (delete whole gallery) ========== -->
			<div class="d-flex align-items-center justify-content-between mb-2">
				<span class="fw-bold">{{ gallery.caption }}</span>
				<button
					class="btn btn-sm btn-danger"
					:disabled="isDeleting"
					@click="confirmDeleteGallery(gallery.galleryDB_id)">
					<span
						v-if="isDeleting && deletingId === gallery.galleryDB_id"
						class="spinner-border spinner-border-sm me-1" />
					Delete Gallery
				</button>
			</div>

			<!-- ========== IMAGES ROW ========== -->
			<div class="d-flex gap-2 flex-wrap">
				<div
					v-for="img in gallery.images"
					:key="img.url"
					class="border p-1 rounded position-relative"
					style="width: 120px">
					<img
						:src="img.url"
						class="img-fluid" />
					<div class="small text-muted mb-1">
						{{ img.subCaption || "no caption" }}
					</div>
					<button
						class="btn btn-sm btn-outline-danger w-100"
						:disabled="isDeleting"
						@click="confirmDeleteImage(gallery.galleryDB_id, img.url)">
						<span
							v-if="isDeleting && deletingUrl === img.url"
							class="spinner-border spinner-border-sm me-1" />
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import type { GalleryInterface } from "./types";

	/* ================= PROPS ================= */
	const props = defineProps<{
		galleries: GalleryInterface[];
	}>();

	/* ================= EMITS ================= */
	const emit = defineEmits<{
		(e: "deleted"): void;
	}>();

	/* ================= STATE ================= */
	const isDeleting = ref<boolean>(false);
	const deletingId = ref<number | null>(null);
	const deletingUrl = ref<string | null>(null);
	const error = ref<string>("");

	/* ================= DELETE GALLERY ================= */
	async function confirmDeleteGallery(id: number): Promise<void> {
		if (!confirm("Delete entire gallery? This cannot be undone.")) return;

		error.value = "";
		isDeleting.value = true;
		deletingId.value = id;

		try {
			const res = await fetch("/api/gallery/deleteGallery", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: "gallery", galleryDB_id: id }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			emit("deleted");
		} catch (err: unknown) {
			error.value =
				err instanceof Error ? err.message : "Failed to delete gallery";
		} finally {
			isDeleting.value = false;
			deletingId.value = null;
		}
	}

	/* ================= DELETE IMAGE ================= */
	async function confirmDeleteImage(id: number, url: string): Promise<void> {
		if (!confirm("Delete this image? This cannot be undone.")) return;

		error.value = "";
		isDeleting.value = true;
		deletingUrl.value = url;

		try {
			const res = await fetch("/api/gallery/deleteGallery", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "image",
					galleryDB_id: id,
					imageUrl: url,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			emit("deleted");
		} catch (err: unknown) {
			error.value =
				err instanceof Error ? err.message : "Failed to delete image";
		} finally {
			isDeleting.value = false;
			deletingUrl.value = null;
		}
	}
</script>
