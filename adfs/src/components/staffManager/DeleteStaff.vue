<template>
	<div class="row g-3 py-4">
		<!-- EMPTY -->
		<div
			v-if="all.length === 0"
			class="text-center text-muted w-100">
			No staff available
		</div>

		<!-- SUCCESS -->
		<div
			v-if="successMessage"
			class="green lighten-4 green-text text-darken-3 p-3 mt-3 rounded text-center w-100">
			{{ successMessage }}
		</div>

		<!-- STAFF CARDS -->
		<div
			v-for="staff in all"
			:key="staff.id"
			class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
			<div
				class="card shadow-sm border-0 h-100"
				style="max-width: 350px; cursor: pointer"
				@click="openDeleteBox(staff)">
				<img
					:src="staff.imageUrl"
					class="card-img-top"
					style="height: 200px; object-fit: cover" />

				<div class="card-body">
					<h5 class="text-uppercase">
						{{ staff.name }}
					</h5>

					<p class="text-muted">
						{{ staff.role }}
					</p>
				</div>
			</div>
		</div>

		<!-- DELETE MODAL -->
		<div
			v-if="showDeleteBox"
			class="delete-overlay">
			<div class="delete-box z-depth-3">
				<h5 class="text-danger"> Delete "{{ selectedStaff?.name }}"? </h5>

				<p class="text-muted"> This action cannot be undone. </p>

				<div class="d-flex justify-content-end gap-2 mt-3">
					<button
						class="btn btn-secondary"
						@click="closeDeleteBox">
						Cancel
					</button>

					<button
						class="btn btn-danger"
						@click="handleDelete">
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	interface StaffInterface {
		id: number;
		name: string;
		role: string;
		imageUrl: string;
	}

	const props = defineProps<{
		all: StaffInterface[];
	}>();

	const emit = defineEmits<{
		(e: "deleted"): void;
	}>();

	const showDeleteBox = ref(false);

	const selectedStaff = ref<StaffInterface | null>(null);

	const successMessage = ref("");

	/**
	 * Open delete confirmation modal.
	 */
	function openDeleteBox(staff: StaffInterface): void {
		selectedStaff.value = staff;
		showDeleteBox.value = true;
	}

	/**
	 * Close delete confirmation modal.
	 */
	function closeDeleteBox(): void {
		showDeleteBox.value = false;
		selectedStaff.value = null;
	}

	/**
	 * Emit delete intent to parent and handle API call.
	 */
	async function handleDelete() {
		if (!selectedStaff.value) {
			console.log("No selected staff");
			return;
		}

		try {
			successMessage.value = "Deleting...";
			const response = await fetch("/api/staff/deleteStaff", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: selectedStaff.value.id }),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "failed to delete item");
			}

			successMessage.value = "Staff deleted successfully!";
			emit("deleted");
		} catch (error) {
			console.error(error);
			successMessage.value = "Failed to delete staff. Please try again.";
		} finally {
			closeDeleteBox();
			setTimeout(() => {
				successMessage.value = "";
			}, 3000);
		}
	}
</script>

<style scoped>
	.card:hover {
		transform: scale(1.02);
		transition: 0.2s ease;
	}

	.delete-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 3000;
	}

	.delete-box {
		background: white;
		padding: 20px;
		border-radius: 10px;
		width: 90%;
		max-width: 400px;
	}
</style>
