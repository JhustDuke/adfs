<template>
	<div class="p-2">
		<!-- ================= CAPTION SLOT ================= -->
		<div class="mb-3">
			<label class="form-label">Caption</label>

			<input
				v-model="localCaption"
				type="text"
				class="form-control"
				placeholder="gallery caption" />
		</div>

		<hr />

		<div class="text-muted mb-3"> Min 3 images, Max 5 images </div>

		<!-- ================= IMAGE LIST ================= -->
		<div
			v-for="(img, index) in images"
			:key="index"
			class="mb-3 border rounded p-2">
			<label class="form-label"> Image {{ index + 1 }} </label>

			<input
				type="file"
				class="form-control mb-2"
				@change="onFileChange($event, index)" />

			<!-- preview (optional) -->
			<div
				v-if="img.url"
				class="mb-2">
				<img
					:src="img.url"
					class="img-fluid rounded"
					style="max-height: 120px" />
			</div>

			<label class="form-label">Sub Caption</label>

			<input
				v-model="img.subCaption"
				type="text"
				class="form-control"
				placeholder="optional" />

			<div class="text-muted small mt-1">
				a sub caption to describe what this image represents e.g before,after,
				pre
			</div>
		</div>

		<!-- ================= ACTIONS SLOT ================= -->
		<div class="d-flex gap-2 mt-3">
			<button
				class="btn btn-secondary"
				:disabled="images.length <= 3"
				@click="remove">
				Remove
			</button>

			<button
				class="btn btn-secondary"
				:disabled="images.length >= 5"
				@click="add">
				Add
			</button>

			<!-- submit delegated -->
			<button
				class="btn btn-primary"
				:disabled="!canSubmit"
				@click="emitSubmit">
				{{ submitLabel }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import { type ImageInterface } from "./types";

	/* ================= PROPS ================= */
	const props = defineProps<{
		modelValue?: {
			caption: string;
			images: ImageInterface[];
		};
		submitLabel?: string;
	}>();

	/* ================= EMITS ================= */
	const emit = defineEmits<{
		(e: "submit", payload: any): void;
	}>();

	/* ================= STATE ================= */
	const localCaption = ref<string>("");
	const images = ref<ImageInterface[]>([]);

	/* ================= INIT ================= */
	watch(
		() => props.modelValue,
		function (val) {
			if (!val) return;

			localCaption.value = val.caption;

			if (images.value) {
				images.value = val.images.map(function (img) {
					return {
						url: img.url || "",
						subCaption: img.subCaption || "",
						file: null,
					};
				});
			}
		},
		{ immediate: true }
	);

	/* ================= FILE ================= */
	function onFileChange(event: Event, index: number): void {
		const target = event.target as HTMLInputElement;

		if (!target.files || !target.files[0]) return;

		images.value[index].file = target.files[0];
	}

	/* ================= ADD ================= */
	function add(): void {
		if (images.value.length >= 5) return;

		images.value.push({
			url: "",
			subCaption: "",
			file: null,
		});
	}

	/* ================= REMOVE ================= */
	function remove(): void {
		if (images.value.length <= 3) return;

		images.value.pop();
	}

	/* ================= VALIDATION ================= */
	const canSubmit = computed(function (): boolean {
		return (
			localCaption.value.trim().length > 0 &&
			images.value.length >= 3 &&
			images.value.every(function (img) {
				return img.url || img.file;
			})
		);
	});

	/* ================= EMIT SUBMIT ================= */
	function emitSubmit(): void {
		if (!canSubmit.value) return;

		emit("submit", {
			caption: localCaption.value,
			images: images.value,
		});
	}

	const submitLabel = props.submitLabel ?? "Submit";
</script>
