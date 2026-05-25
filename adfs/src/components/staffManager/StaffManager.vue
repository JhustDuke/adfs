<template>
	<div class="p-3">
		<select
			v-model="mode"
			class="form-select mb-3">
			<option value="all">All Staff</option>
			<option value="create">Create</option>
			<option value="update">Update</option>
			<option value="delete">Delete</option>
		</select>

		<!-- LOADING -->
		<div
			v-if="loading"
			class="d-flex justify-content-center align-items-center py-5">
			<div
				class="spinner-border text-blue darken-2"
				role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>

		<!-- ERROR -->
		<div
			v-else-if="error"
			class="d-flex flex-column align-items-center py-5 gap-2">
			<p class="red-text darken-2 mb-0">{{ error }}</p>
			<button
				class="btn blue darken-2 text-white"
				@click="fetchStaff">
				Retry
			</button>
		</div>

		<!-- CONTENT -->
		<template v-else>
			<!-- ALL -->
			<div v-if="mode === 'all'">
				<div
					v-if="!staff.length"
					class="text-center grey-text py-5">
					No staff available
				</div>
				<div
					v-else
					class="row g-3 py-3">
					<div
						v-for="s in staff"
						:key="s.id"
						class="col-12 col-md-6 col-lg-4">
						<div class="card shadow-sm border-0 h-100">
							<img
								:src="s.imageUrl"
								class="card-img-top"
								style="height: 220px; object-fit: cover" />
							<div class="card-body">
								<h5 class="text-uppercase fw-bold">{{ s.name }}</h5>
								<p class="grey-text mb-0">{{ s.role }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- CREATE -->
			<div v-if="mode === 'create'">
				<CreateStaff @created="refreshAndReturn" />
			</div>

			<!-- UPDATE -->
			<div v-if="mode === 'update'">
				<UpdateStaff
					:all="staff"
					@updated="refreshAndReturn" />
			</div>

			<!-- DELETE -->
			<div v-if="mode === 'delete'">
				<DeleteStaff
					:all="staff"
					@deleted="refreshAndReturn" />
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import CreateStaff from "./CreateStaff.vue";
	import UpdateStaff from "./UpdateStaff.vue";
	import DeleteStaff from "./DeleteStaff.vue";

	type Mode = "all" | "create" | "update" | "delete";

	interface StaffInterface {
		id: number;
		name: string;
		role: string;
		imageUrl: string;
	}

	const mode = ref<Mode>("all");
	const staff = ref<StaffInterface[]>([]);
	const loading = ref(false);
	const error = ref("");

	async function fetchStaff(): Promise<void> {
		loading.value = true;
		error.value = "";

		try {
			const res = await fetch("/api/staff/getAllStaffs");
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || "failed to fetch staff");
			}

			staff.value = data;
		} catch (err: any) {
			error.value = err?.message ?? "Failed to load staff. Please try again.";
		} finally {
			loading.value = false;
		}
	}

	function refreshAndReturn(): void {
		fetchStaff();
		mode.value = "all";
	}

	onMounted(fetchStaff);
</script>
