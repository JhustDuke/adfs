<template>
	<div class="p-2">
		<!-- ================= CAPTION ================= -->
		<div class="mb-3">
			<label class="form-label">Caption</label>
			<input
				v-model="localCaption"
				type="text"
				class="form-control"
				placeholder="e.g. Inter House Sport" />
		</div>

		<!-- ================= MONTH / YEAR ================= -->
		<div class="row mb-3">
			<div class="col-6">
				<label class="form-label">Month</label>
				<select
					v-model="localMonth"
					class="form-select">
					<option
						value=""
						disabled>
						Select month
					</option>
					<option
						v-for="m in months"
						:key="m"
						:value="m">
						{{ m }}
					</option>
				</select>
			</div>
			<div class="col-6">
				<label class="form-label">Year</label>
				<select
					v-model="localYear"
					class="form-select">
					<option
						value=""
						disabled>
						Select year
					</option>
					<option
						v-for="y in years"
						:key="y"
						:value="y">
						{{ y }}
					</option>
				</select>
			</div>
		</div>

		<hr />
		<div class="text-muted mb-3 small">Min 3 images — Max 5 images</div>

		<!-- ================= IMAGE LIST ================= -->
		<div
			v-for="(img, index) in images"
			:key="index"
			class="mb-3 border rounded p-2">
			<label class="form-label fw-semibold">Image {{ index + 1 }}</label>

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
				:disabled="images.length <= 3 || props.isLoading"
				@click="remove">
				Remove
			</button>

			<button
				class="btn btn-secondary"
				:disabled="images.length >= 5 || props.isLoading"
				@click="add">
				Add
			</button>

			<button
				class="btn ms-auto"
				:class="{
					'btn-primary': !props.isDone,
					'btn-success': props.isDone,
				}"
				:disabled="!canSubmit || props.isLoading"
				@click="emitSubmit">
				<span
					v-if="props.isLoading"
					class="spinner-border spinner-border-sm me-2">
				</span>
				<span v-if="props.isDone">✓ Done</span>
				<span v-else>{{ submitLabel }}</span>
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
			month: string;
			year: number;
			images: ImageInterface[];
		};
		submitLabel?: string;
		isLoading?: boolean;
		isDone?: boolean;
		isDirty?: boolean;
	}>();

	/* ================= EMITS ================= */
	const emit = defineEmits<{
		(
			e: "submit",
			payload: {
				caption: string;
				month: string;
				year: number;
				images: ImageInterface[];
			}
		): void;
		(
			e: "change",
			payload: {
				caption: string;
				month: string;
				year: number;
				images: ImageInterface[];
			}
		): void;
	}>();

	/* ================= STATE ================= */
	const localCaption = ref<string>("");
	const localMonth = ref<string>("");
	const localYear = ref<number | "">("");
	const images = ref<ImageInterface[]>([
		{ url: "", subCaption: "", file: null },
		{ url: "", subCaption: "", file: null },
		{ url: "", subCaption: "", file: null },
	]);

	/* ================= MONTH / YEAR OPTIONS ================= */
	const months: string[] = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const currentYear = new Date().getFullYear();
	const years: number[] = Array.from({ length: 10 }, function (_, i): number {
		return currentYear - i;
	});

	/* ================= INIT FROM modelValue ================= */
	/* Uses a stable computed ref in the parent so this only fires
	   when the selected gallery actually changes, not on every re-render */
	watch(
		() => props.modelValue,
		function (val) {
			if (!val) return;
			localCaption.value = val.caption;
			localMonth.value = val.month;
			localYear.value = val.year;
			images.value = val.images.map(function (img) {
				return {
					url: img.url || "",
					subCaption: img.subCaption || "",
					file: null,
				};
			});
		},
		{ immediate: true }
	);

	/* ================= EMIT CHANGE ON ANY FIELD UPDATE ================= */
	watch(
		[localCaption, localMonth, localYear, images],
		function () {
			emit("change", {
				caption: localCaption.value,
				month: localMonth.value,
				year: localYear.value as number,
				images: images.value,
			});
		},
		{ deep: true }
	);

	/* ================= FILE CHANGE ================= */
	function onFileChange(event: Event, index: number): void {
		const target = event.target as HTMLInputElement;
		if (!target.files || !target.files[0]) return;
		const file: File = target.files[0];
		images.value[index].file = file;
		images.value[index].url = URL.createObjectURL(file);
	}

	/* ================= ADD / REMOVE ================= */
	function add(): void {
		if (images.value.length >= 5) return;
		images.value.push({ url: "", subCaption: "", file: null });
	}

	function remove(): void {
		if (images.value.length <= 3) return;
		images.value.pop();
	}

	/* ================= VALIDATION ================= */
	const canSubmit = computed(function (): boolean {
		const baseValid =
			localCaption.value.trim().length > 0 &&
			localMonth.value !== "" &&
			localYear.value !== "" &&
			images.value.length >= 3;

		// update mode: enable if something changed (isDirty) OR new files picked
		if (props.isDirty !== undefined) {
			const hasNewFiles = images.value.some(function (img) {
				return img.file !== null;
			});
			return baseValid && (props.isDirty || hasNewFiles);
		}

		// create mode: all images must have files
		return (
			baseValid &&
			images.value.every(function (img) {
				return img.file !== null;
			})
		);
	});

	/* ================= SUBMIT LABEL ================= */
	const submitLabel = computed(function (): string {
		return props.submitLabel ?? "Submit";
	});

	/* ================= EMIT SUBMIT ================= */
	function emitSubmit(): void {
		if (!canSubmit.value) return;
		if (props.isLoading) return;
		emit("submit", {
			caption: localCaption.value,
			month: localMonth.value,
			year: localYear.value as number,
			images: images.value,
		});
	}
</script>
