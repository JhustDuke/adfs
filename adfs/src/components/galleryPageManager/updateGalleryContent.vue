<template>
	<div class="p-2">
		<!-- ================= GALLERY SELECT ================= -->
		<select
			v-model="selected"
			class="form-select mb-3">
			<option
				disabled
				value="">
				Select a gallery to update
			</option>
			<option
				v-for="g in props.galleries"
				:key="g.galleryDB_id"
				:value="g">
				{{ g.caption }}
			</option>
		</select>

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
			Gallery updated successfully!
		</div>

		<!-- ================= FORM ================= -->
		<GalleryForm
			v-if="selected"
			:model-value="formValue"
			submit-label="Update Gallery"
			:is-loading="isLoading"
			:is-done="isDone"
			:is-dirty="hasChanges"
			@change="onFormChange"
			@submit="submit" />
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, computed } from "vue";
	import GalleryForm from "./GalleryForm.vue";
	import { type GalleryInterface, type ImageInterface } from "./types";

	/* ================= PROPS / EMITS ================= */
	const props = defineProps<{ galleries: GalleryInterface[] }>();
	const emit = defineEmits<{ (e: "updated"): void }>();

	/* ================= STATE ================= */
	const selected = ref<GalleryInterface | "">("");
	const original = ref<GalleryInterface | null>(null);
	const current = ref<{
		caption: string;
		month: string;
		year: number;
		images: ImageInterface[];
	} | null>(null);
	const isLoading = ref<boolean>(false);
	const isDone = ref<boolean>(false);
	const error = ref<string>("");
	const success = ref<boolean>(false);

	/* ================= STABLE FORM VALUE ================= */
	/* computed so Vue sees the same object reference between renders
	   — prevents GalleryForm's modelValue watch from re-firing on
	   every @change emit and overwriting what the user is typing    */
	const formValue = computed(function () {
		if (!selected.value) return undefined;
		return {
			caption: selected.value.caption,
			images: selected.value.images,
			month: selected.value.month,
			year: selected.value.year,
		};
	});

	/* ================= TRACK ORIGINAL ON SELECT ================= */
	watch(
		selected,
		function (val) {
			if (!val) {
				original.value = null;
				current.value = null;
				return;
			}
			// deep clone to freeze original state for comparison
			original.value = JSON.parse(JSON.stringify(val)) as GalleryInterface;
			current.value = null;
			isDone.value = false;
			success.value = false;
			error.value = "";
		},
		{ immediate: true }
	);

	/* ================= RECEIVE LIVE FORM STATE ================= */
	function onFormChange(payload: {
		caption: string;
		month: string;
		year: number;
		images: ImageInterface[];
	}): void {
		current.value = payload;
	}

	/* ================= DIRTY CHECK ================= */
	const hasChanges = computed(function (): boolean {
		if (!original.value || !current.value) return false;
		return (
			current.value.caption !== original.value.caption ||
			current.value.month !== original.value.month ||
			current.value.year !== original.value.year
		);
	});

	/* ================= SUBMIT ================= */
	async function submit(payload: {
		caption: string;
		month: string;
		year: number;
		images: ImageInterface[];
	}): Promise<void> {
		if (!selected.value) return;

		error.value = "";
		success.value = false;
		isLoading.value = true;

		try {
			const formData = new FormData();

			// always required
			formData.append("collectionId", String(selected.value.galleryDB_id));

			// only send what changed
			if (payload.caption !== original.value?.caption) {
				formData.append("caption", payload.caption);
			}
			if (payload.month !== original.value?.month) {
				formData.append("month", payload.month);
			}
			if (payload.year !== original.value?.year) {
				formData.append("year", String(payload.year));
			}

			// images only if new files were picked
			const hasNewFiles = payload.images.some((img) => img.file !== null);
			if (hasNewFiles) {
				payload.images.forEach(function (img, i) {
					if (img.file) formData.append("images", img.file);
					formData.append(`subcaption_${i}`, img.subCaption || "");
				});
			}

			const res = await fetch("/api/gallery/updateGallery", {
				method: "PATCH",
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			isDone.value = true;
			success.value = true;

			setTimeout(function () {
				emit("updated");
			}, 800);
		} catch (err: unknown) {
			error.value =
				err instanceof Error ? err.message : "Failed to update gallery";
		} finally {
			isLoading.value = false;
		}
	}
</script>
