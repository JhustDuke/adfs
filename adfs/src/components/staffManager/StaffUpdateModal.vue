<template>
	<div class="modal-overlay">
		<div
			class="modal-backdrop"
			@click="closeModal"></div>
		<div class="modal-box">
			<!-- HEADER -->
			<div class="modal-header">
				<h5 class="m-0">Update Staff</h5>
				<button
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<!-- SUCCESS -->
			<p
				v-if="success"
				class="green-text darken-2 text-center mb-0">
				Staff updated successfully!
			</p>

			<!-- ERROR -->
			<p
				v-if="errorMsg"
				class="red-text darken-2 text-center mb-0">
				{{ errorMsg }}
			</p>

			<!-- BODY -->
			<div class="modal-body">
				<!-- OPTIONAL IMAGE UPLOAD -->
				<div class="mb-3">
					<label class="form-label">
						Upload New Image <span class="grey-text">(optional)</span>
					</label>
					<input
						type="file"
						class="form-control"
						@change="handleNewImage" />
					<img
						v-if="newImageUrl"
						:src="newImageUrl"
						class="preview-img mt-2" />
				</div>

				<!-- NAME -->
				<div class="mb-3">
					<label class="form-label">Name</label>
					<input
						v-model="localName"
						class="form-control" />
				</div>

				<!-- ROLE -->
				<div class="mb-3">
					<label class="form-label">Role</label>
					<select
						v-model="localRole"
						class="form-select">
						<option value="staff">Staff</option>
						<option value="secretary">Secretary</option>
						<option value="admin">Admin</option>
						<option value="director">Director</option>
						<option value="proprietor">Proprietor</option>
					</select>
				</div>
			</div>

			<!-- ACTION -->
			<button
				class="btn btn-primary w-100"
				:disabled="loading || success"
				@click="confirm">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"
					role="status" />
				{{ loading ? "Saving..." : "Confirm & Update" }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch } from "vue";

	interface Staff {
		id: number;
		name: string;
		role: string;
		imageUrl: string;
	}

	const props = defineProps<{
		staff: Staff;
		loading: boolean;
		errorMsg: string;
		success: boolean;
	}>();

	const emit = defineEmits<{
		(e: "close"): void;
		(
			e: "confirm",
			payload: {
				id: number;
				name: string;
				role: string;
				imageFile: File | null;
			}
		): void;
	}>();

	const localName = ref("");
	const localRole = ref("staff");
	const newImageFile = ref<File | null>(null);
	const newImageUrl = ref("");

	watch(
		() => props.staff,
		function (val) {
			localName.value = val.name;
			localRole.value = val.role;
			newImageFile.value = null;
			newImageUrl.value = "";
		},
		{ immediate: true }
	);

	function confirm(): void {
		emit("confirm", {
			id: props.staff.id,
			name: localName.value,
			role: localRole.value,
			imageFile: newImageFile.value,
		});
	}

	function closeModal(): void {
		emit("close");
	}

	// --- HELPERS ---

	function handleNewImage(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) return;
		const file = target.files[0];
		newImageFile.value = file;
		newImageUrl.value = URL.createObjectURL(file);
	}
</script>

<style scoped>
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.modal-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}
	.modal-box {
		position: relative;
		background: #fff;
		width: 92%;
		max-width: 500px;
		border-radius: 10px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 90vh;
		overflow: hidden;
		z-index: 10000;
	}
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.modal-body {
		overflow-y: auto;
		max-height: 60vh;
		padding-right: 5px;
	}
	.preview-img {
		width: 100%;
		max-height: 220px;
		object-fit: cover;
		border-radius: 8px;
		display: block;
	}
</style>
