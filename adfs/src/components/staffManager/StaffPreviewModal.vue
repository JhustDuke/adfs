<template>
	<!-- modal container -->
	<div
		class="isAbsolute d-flex justify-content-center align-items-center w-100"
		style="inline-size: 0; z-index: 9999; top: 0">
		<!-- backdrop -->
		<div
			class="grey lighten-3"
			style="position: absolute; inset: 0"
			@click="emit('close')"></div>

		<!-- modal-->
		<div
			class="isRelative d-flex flex-column p-1 gap-1"
			style="
				width: 92%;
				max-width: 500px;
				border-radius: 10px;
				background: #fff;
				max-height: 90vh;
				overflow: hidden;
				z-index: 10000;
			">
			<!-- HEADER -->
			<div class="mod-header d-flex justify-content-between align-items-center">
				<h5 class="m-0">Preview Staff</h5>
				<button
					class="btn-close"
					@click="emit('close')"></button>
			</div>

			<!-- BODY -->
			<div style="overflow-y: auto; max-height: 60vh; padding-right: 5px">
				<!-- IMAGE -->
				<img
					v-if="staff.imageUrl"
					:src="staff.imageUrl"
					class="mb-3 d-block w-100"
					style="max-height: 220px; object-fit: cover; border-radius: 8px" />

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

<style scoped></style>
