<template>
	<div class="isRelative">
		<div class="row g-3 mb-3">
			<div class="col-12">
				<div class="p-3 shadow-sm border-0">
					<!-- NAME -->
					<div class="mb-3">
						<label class="form-label">Staff Name</label>
						<input
							v-model="form.name"
							type="text"
							class="form-control"
							placeholder="Enter staff name" />
					</div>

					<!-- IMAGE -->
					<div class="mb-3">
						<label class="form-label">Staff Picture</label>
						<input
							type="file"
							class="form-control"
							@change="handleFile" />
					</div>

					<!-- ROLE -->
					<div class="mb-3">
						<label class="form-label">Job Role</label>
						<select
							v-model="form.role"
							class="form-select">
							<option value="staff">Staff</option>
							<option value="secretary">Secretary</option>
							<option value="admin">Admin</option>
							<option value="director">Director</option>
							<option value="proprietor">Proprietor</option>
						</select>
					</div>

					<!-- PREVIEW BUTTON -->
					<button
						class="btn btn-primary w-100"
						:disabled="!isFormValid()"
						@click="openPreview">
						Preview Staff
					</button>
				</div>
			</div>
		</div>

		<!-- MODAL -->
		<StaffPreviewModal
			v-if="showModal"
			:staff="buildPreview()"
			:loading="loading"
			:error-msg="error"
			:success="success"
			@close="showModal = false"
			@confirm="emitCreate" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import StaffPreviewModal from "./StaffPreviewModal.vue";

	const emit = defineEmits<{
		(e: "created"): void;
	}>();

	// --- MODAL ---
	const showModal = ref(false);

	// --- FORM ---
	const form = ref({
		name: "",
		role: "staff",
		imageFile: null as File | null,
		imageUrl: "",
	});

	// --- NETWORK ---
	const loading = ref(false);
	const error = ref("");
	const success = ref(false);

	async function emitCreate(): Promise<void> {
		loading.value = true;
		error.value = "";
		success.value = false;

		const formData = new FormData();
		formData.append("name", form.value.name);
		formData.append("role", form.value.role);
		if (form.value.imageFile) {
			formData.append("image", form.value.imageFile);
		}

		try {
			const res = await fetch("/api/staff/createStaff", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Failed to create staff");
			}

			success.value = true;
			emit("created");
		} catch (err: any) {
			error.value = err?.message ?? "Failed to create staff. Please try again.";
		} finally {
			loading.value = false;
		}
	}

	// --- HELPERS ---

	function openPreview(): void {
		if (!isFormValid()) return;
		success.value = false;
		error.value = "";
		showModal.value = true;
	}

	function isFormValid(): boolean {
		return (
			form.value.name.trim().length > 0 &&
			form.value.role.trim().length > 0 &&
			form.value.imageFile !== null
		);
	}

	function buildPreview() {
		return {
			name: form.value.name,
			role: form.value.role,
			imageUrl: form.value.imageUrl,
		};
	}

	function handleFile(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) return;
		const file = target.files[0];
		form.value.imageFile = file;
		form.value.imageUrl = URL.createObjectURL(file);
	}
</script>
