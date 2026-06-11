<template>
	<div class="p-2">
		<!-- ================= GALLERY SELECT ================= -->
		<select
			v-model="selectedGallery"
			class="form-select mb-3">
			<option
				disabled
				value="">
				Select a gallery to add images to
			</option>
			<option
				v-for="g in props.galleries"
				:key="g.galleryDB_id"
				:value="g">
				{{ g.caption }}
			</option>
		</select>

		<!-- ================= EXISTING IMAGES PREVIEW ================= -->
		<div
			v-if="selectedGallery"
			class="mb-3">
			<p class="text-muted small mb-2">
				Current images in
				<strong>{{ selectedGallery.caption }}</strong>
			</p>
			<div class="d-flex flex-wrap gap-2">
				<div
					v-for="img in selectedGallery.images"
					:key="img.url"
					class="border rounded overflow-hidden"
					style="width: 80px; height: 80px">
					<img
						:src="img.url"
						class="w-100 h-100"
						style="object-fit: cover" />
				</div>
			</div>
		</div>

		<!-- ================= NEW IMAGES ================= -->
		<template v-if="selectedGallery">
			<hr />
			<div class="text-muted small mb-3">
				Add up to {{ MAX_IMAGES }} new images
			</div>

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
				Images added successfully!
			</div>

			<div
				v-for="(img, index) in newImages"
				:key="index"
				class="mb-3 border rounded p-2">
				<label class="form-label fw-semibold">
					New Image {{ index + 1 }}
				</label>

				<input
					type="file"
					accept="image/*"
					class="form-control mb-2"
					@change="onFileChange($event, index)" />

				<!-- preview -->
				<div
					v-if="img.url"
					class="mb-2">
					<img
						:src="img.url"
						class="img-fluid rounded"
						style="max-height: 120px; object-fit: cover" />
				</div>

				<label class="form-label">Sub Caption</label>
				<input
					v-model="img.subCaption"
					type="text"
					class="form-control"
					placeholder="optional — e.g. before, after, pre" />
			</div>

			<!-- ================= ACTIONS ================= -->
			<div class="d-flex gap-2 mt-3">
				<button
					class="btn btn-secondary"
					:disabled="newImages.length <= 1 || isLoading"
					@click="remove">
					Remove
				</button>

				<button
					class="btn btn-secondary"
					:disabled="newImages.length >= MAX_IMAGES || isLoading"
					@click="add">
					Add
				</button>

				<button
					class="btn ms-auto"
					:class="{
						'btn-primary': !isDone,
						'btn-success': isDone,
					}"
					:disabled="!canSubmit || isLoading"
					@click="submit">
					<span
						v-if="isLoading"
						class="spinner-border spinner-border-sm me-2">
					</span>

					<span v-if="isDone">✓ Done</span>
					<span v-else>Add Images</span>
				</button>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import { type GalleryInterface, type ImageInterface } from "./types";

	/* ================= CONSTANTS ================= */
	const MAX_IMAGES = 5;

	/* ================= PROPS / EMITS ================= */
	const props = defineProps<{ galleries: GalleryInterface[] }>();
	const emit = defineEmits<{ (e: "added"): void }>();

	/* ================= STATE ================= */
	const selectedGallery = ref<GalleryInterface | "">("");
	const isLoading = ref<boolean>(false);
	const isDone = ref<boolean>(false);
	const error = ref<string>("");
	const success = ref<boolean>(false);

	const newImages = ref<ImageInterface[]>([
		{ url: "", subCaption: "", file: null },
	]);

	/* ================= RESET ON GALLERY CHANGE ================= */
	watch(selectedGallery, function () {
		newImages.value = [{ url: "", subCaption: "", file: null }];
		error.value = "";
		success.value = false;
		isDone.value = false;
	});

	/* ================= FILE CHANGE ================= */
	function onFileChange(event: Event, index: number): void {
		const target = event.target as HTMLInputElement;
		if (!target.files || !target.files[0]) return;
		const file: File = target.files[0];
		newImages.value[index].file = file;
		newImages.value[index].url = URL.createObjectURL(file);
	}

	/* ================= ADD / REMOVE ================= */
	function add(): void {
		if (newImages.value.length >= MAX_IMAGES) return;
		newImages.value.push({ url: "", subCaption: "", file: null });
	}

	function remove(): void {
		if (newImages.value.length <= 1) return;
		newImages.value.pop();
	}

	/* ================= VALIDATION ================= */
	const canSubmit = computed(function (): boolean {
		return (
			selectedGallery.value !== "" &&
			newImages.value.length >= 1 &&
			newImages.value.every(function (img) {
				return img.file !== null;
			})
		);
	});

	/* ================= SUBMIT ================= */
	async function submit(): Promise<void> {
		if (!canSubmit.value || !selectedGallery.value) return;

		error.value = "";
		success.value = false;
		isLoading.value = true;

		try {
			const formData = new FormData();
			formData.append(
				"collectionId",
				String(selectedGallery.value.galleryDB_id)
			);

			newImages.value.forEach(function (img, i) {
				if (img.file) formData.append("images", img.file);
				formData.append(`subcaption_${i}`, img.subCaption || "");
			});

			const res = await fetch("/api/gallery/addToExistingGallery", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			isDone.value = true;
			success.value = true;

			setTimeout(function () {
				emit("added");
			}, 800);
		} catch (err: unknown) {
			error.value = err instanceof Error ? err.message : "Failed to add images";
		} finally {
			isLoading.value = false;
		}
	}
</script>
