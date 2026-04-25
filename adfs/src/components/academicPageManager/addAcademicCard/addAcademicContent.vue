<template>
	<div class="card shadow-sm border-0 p-3">
		<!-- HEADER -->
		<div class="mb-3">
			<h5 class="blue-text text-darken-3 mb-0"> Create Academic Page Item </h5>
		</div>

		<!-- CAPTION -->
		<div class="mb-3">
			<label class="form-label text-muted">Caption</label>
			<input
				v-model="form.caption"
				class="form-control" />
		</div>

		<!-- EXCERPTS -->
		<div class="mb-3">
			<label class="form-label text-muted">Excerpts</label>
			<textarea
				v-model="form.excerpts"
				rows="4"
				class="form-control"></textarea>
		</div>

		<!-- IMAGE -->
		<div class="mb-3">
			<label class="form-label text-muted">Image</label>
			<input
				type="file"
				class="form-control"
				@change="handleFile" />
		</div>

		<!-- CAPTION COLOR -->
		<div class="mb-3">
			<label class="form-label text-muted">Caption Color</label>
			<select
				v-model="form.captionColor"
				class="form-select">
				<option
					v-for="c in colors"
					:key="c.value"
					:value="c.value">
					{{ c.label }}
				</option>
			</select>
		</div>

		<!-- BG COLOR -->
		<div class="mb-3">
			<label class="form-label text-muted">Background Color</label>
			<select
				v-model="form.bgColor"
				class="form-select">
				<option
					v-for="c in bgColors"
					:key="c.value"
					:value="c.value">
					{{ c.label }}
				</option>
			</select>
		</div>

		<!-- OPEN PREVIEW -->
		<button
			class="btn btn-primary w-100"
			:disabled="!form.caption || !form.excerpts"
			@click="openPreview">
			Open Preview
		</button>

		<!-- MODAL -->
		<AcademicPreview
			:show="showPreview"
			:caption="form.caption"
			:excerpts="form.excerpts"
			:imageSrc="imageUrl"
			:captionColor="form.captionColor"
			:bgColor="form.bgColor"
			:loading="loading"
			:errorMessage="error"
			:successMessage="success"
			@close="closePreview"
			@confirm="submit" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import AcademicPreview from "./previewAcademicCard.vue";
	import { resolveTextClass, resolveBgClass } from "./normalizeColors";
	import { bgColors, colors } from "./uiColors";

	const form = ref({
		caption: "",
		excerpts: "",
		captionColor: "black",
		bgColor: "grey",
	});

	const imageFile = ref<File | null>(null);
	const imageUrl = ref("");

	const showPreview = ref(false);

	const loading = ref(false);
	const error = ref("");
	const success = ref("");

	async function submit(): Promise<void> {
		if (loading.value) return;

		loading.value = true;
		error.value = "";
		success.value = "";

		try {
			const formData = new FormData();

			formData.append("caption", form.value.caption);
			formData.append("excerpts", form.value.excerpts);

			// ✅ using extracted helpers
			formData.append(
				"textCaptionColor",
				resolveTextClass(form.value.captionColor)
			);

			formData.append("bgColor", resolveBgClass(form.value.bgColor));

			if (imageFile.value) {
				formData.append("image", imageFile.value);
			}

			const res = await fetch("/api/academic/createAcademicCard", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || "Request failed");
			}

			const data = await res.json();
			success.value = data.message || "Created successfully";

			setTimeout(function () {
				showPreview.value = false;
				window.location.reload();
			}, 2000);
		} catch (e: any) {
			error.value = e.message;
		} finally {
			loading.value = false;
		}
	}

	function handleFile(e: Event): void {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		imageFile.value = file;
		imageUrl.value = URL.createObjectURL(file);
	}

	function openPreview(): void {
		showPreview.value = true;
	}

	function closePreview(): void {
		showPreview.value = false;
	}
</script>
