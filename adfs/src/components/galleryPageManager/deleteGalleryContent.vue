<template>
	<div class="p-3">
		<!-- ================= GALLERIES ================= -->
		<div
			v-for="gallery in galleries"
			:key="gallery.galleryDB_id"
			class="mb-4 border rounded p-2">
			<!-- CAPTION (delete whole gallery) -->
			<div
				class="fw-bold mb-2 text-danger"
				role="button"
				@click="confirmDeleteGallery(gallery.galleryDB_id)">
				{{ gallery.caption }} (delete gallery)
			</div>

			<!-- ================= IMAGES ROW ================= -->
			<div class="d-flex gap-2 flex-wrap">
				<div
					v-for="img in gallery.images"
					:key="img.url"
					class="border p-1 rounded"
					style="width: 120px; cursor: pointer"
					@click="confirmDeleteImage(gallery.galleryDB_id, img.url)">
					<img
						:src="img.url"
						class="img-fluid" />

					<div class="small text-muted">
						{{ img.subCaption || "no caption" }}
					</div>
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
		(e: "delete", payload: any): void;
	}>();

	/* ================= DELETE GALLERY ================= */
	function confirmDeleteGallery(id: number): void {
		if (!confirm("Delete entire gallery?")) return;
		console.log("deleted entire gallery");
		emit("delete", {
			type: "gallery",
			galleryDB_id: id,
		});
	}

	/* ================= DELETE IMAGE ================= */
	function confirmDeleteImage(id: number, url: string): void {
		if (!confirm("Delete this image?")) return;
		console.log("deleted image");

		emit("delete", {
			type: "image",
			galleryDB_id: id,
			imageUrl: url,
		});
	}
</script>
