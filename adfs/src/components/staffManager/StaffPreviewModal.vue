<template>
	<div class="modal-overlay">
		<div
			class="modal-backdrop"
			@click="emit('close')"></div>
		<div class="modal-box">
			<!-- HEADER -->
			<div class="modal-header">
				<h5 class="m-0">Preview Staff</h5>
				<button
					class="btn-close"
					@click="emit('close')"></button>
			</div>

			<!-- BODY -->
			<div class="modal-body">
				<!-- IMAGE -->
				<img
					v-if="staff.imageUrl"
					:src="staff.imageUrl"
					class="preview-img mb-3" />

				<!-- NAME -->
				<div class="mb-2">
					<span class="grey-text small">Name</span>
					<p class="fw-semibold mb-0">{{ staff.name }}</p>
				</div>

				<!-- ROLE -->
				<div class="mb-2">
					<span class="grey-text small">Role</span>
					<p class="fw-semibold mb-0 text-capitalize">{{ staff.role }}</p>
				</div>
			</div>

			<!-- ERROR -->
			<p
				v-if="errorMsg"
				class="red-text darken-2 text-center mb-0">
				{{ errorMsg }}
			</p>

			<!-- SUCCESS -->
			<p
				v-if="success"
				class="green-text darken-2 text-center mb-0">
				Staff created successfully!
			</p>

			<!-- ACTION -->
			<button
				class="btn btn-primary w-100"
				:disabled="loading || success"
				@click="emit('confirm')">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"
					role="status" />
				{{ loading ? "Saving..." : "Confirm & Create" }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface StaffPreview {
		name: string;
		role: string;
		imageUrl: string;
	}

	defineProps<{
		staff: StaffPreview;
		loading: boolean;
		errorMsg: string;
		success: boolean;
	}>();

	const emit = defineEmits<{
		(e: "close"): void;
		(e: "confirm"): void;
	}>();
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
