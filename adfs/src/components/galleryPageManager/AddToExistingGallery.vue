<template>
	<div class="p-3">
		<!-- ================= SELECT GALLERY ================= -->
		<select
			v-model="selectedGalleryId"
			class="form-select mb-3">
			<option
				v-for="g in galleries"
				:key="g.galleryDB_id"
				:value="g.galleryDB_id">
				{{ g.caption }}
			</option>
		</select>

		<!-- ================= IMAGES POOL ================= -->
		<div v-if="selectedGallery">
			<div class="d-flex flex-wrap gap-2">
				<div
					v-for="img in selectedGallery.images"
					:key="img.url"
					class="border p-1 rounded"
					style="width: 120px; cursor: pointer"
					:class="{ 'border-primary': isSelected(img.url) }"
					@click="toggle(img)">
					<img
						:src="img.url"
						class="img-fluid" />

					<div class="small text-muted">
						{{ img.subCaption || "no caption" }}
					</div>
				</div>
			</div>
		</div>

		<!-- ================= ACTION ================= -->
		<button
			class="btn btn-primary mt-3"
			:disabled="selectedImages.length === 0"
			@click="submit">
			Add Selected Images
		</button>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import type { GalleryInterface } from "./types";

	/* ================= PROPS ================= */
	const props = defineProps<{
		galleries: GalleryInterface[];
	}>();

	/* ================= EMIT ================= */
	const emit = defineEmits<{
		(e: "add", payload: any): void;
	}>();

	/* ================= STATE ================= */
	const selectedGalleryId = ref<number | null>(null);
	const selectedImages = ref<string[]>([]);

	/* ================= COMPUTED ================= */
	const selectedGallery = computed(function () {
		return props.galleries.find(function (g) {
			return g.galleryDB_id === selectedGalleryId.value;
		});
	});

	/* ================= TOGGLE ================= */
	function toggle(img: any): void {
		const index = selectedImages.value.indexOf(img.url);

		if (index >= 0) {
			selectedImages.value.splice(index, 1);
			return;
		}

		selectedImages.value.push(img.url);
	}

	/* ================= CHECK ================= */
	function isSelected(url: string): boolean {
		return selectedImages.value.includes(url);
	}

	/* ================= SUBMIT ================= */
	function submit(): void {
		if (!selectedGallery.value) return;

		const images = selectedGallery.value.images.filter(function (img) {
			return selectedImages.value.includes(img.url);
		});

		emit("add", {
			galleryDB_id: selectedGallery.value.galleryDB_id,
			images,
		});
	}
</script>
