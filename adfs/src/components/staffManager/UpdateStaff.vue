<template>
	<div>
		<!-- GRID -->
		<div class="row g-3">
			<div
				v-for="s in all"
				:key="s.id"
				class="col-12 col-md-6 col-lg-4">
				<div
					class="card p-3 shadow-sm h-100"
					style="cursor: pointer"
					@click="open(s)">
					<img
						:src="s.imageUrl"
						class="rounded-3 mb-2"
						style="height: 180px; width: 100%; object-fit: cover" />
					<h6 class="fw-bold">{{ s.name }}</h6>
					<small class="grey-text">{{ s.role }}</small>
				</div>
			</div>
		</div>

		<!-- MODAL -->
		<StaffUpdateModal
			v-if="showModal && selected"
			:staff="selected"
			:loading="loading"
			:error-msg="error"
			:success="success"
			@close="close"
			@confirm="emitUpdate" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	//@ts-ignore
	import StaffUpdateModal from "./StaffUpdateModal.vue";

	interface StaffInterface {
		id: number;
		name: string;
		role: string;
		imageUrl: string;
	}

	defineProps<{
		all: StaffInterface[];
	}>();

	const emit = defineEmits<{
		(e: "updated"): void;
	}>();

	// --- MODAL ---
	const showModal = ref(false);
	const selected = ref<StaffInterface | null>(null);

	// --- NETWORK ---
	const loading = ref(false);
	const error = ref("");
	const success = ref(false);

	async function emitUpdate(payload: {
		id: number;
		name: string;
		role: string;
		imageFile: File | null;
	}): Promise<void> {
		loading.value = true;
		error.value = "";
		success.value = false;

		const formData = new FormData();
		formData.append("id", String(payload.id));
		formData.append("name", payload.name);
		formData.append("role", payload.role);
		if (payload.imageFile) {
			formData.append("image", payload.imageFile);
		}

		try {
			// swap this for real call later
			const res = await fetch("/api/staff/updateStaff", {
				method: "PATCH",
				body: formData,
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "update failed");
			}

			success.value = true;
			emit("updated");
		} catch (err: any) {
			error.value = err?.message ?? "Failed to update staff. Please try again.";
		} finally {
			loading.value = false;
		}
	}

	// --- HELPERS ---

	function open(staff: StaffInterface): void {
		selected.value = staff;
		success.value = false;
		error.value = "";
		showModal.value = true;
	}

	function close(): void {
		showModal.value = false;
		selected.value = null;
	}
</script>
