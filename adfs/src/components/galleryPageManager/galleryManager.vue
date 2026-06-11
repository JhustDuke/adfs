<template>
	<div class="p-3">
		<!-- ================= MODE SELECT ================= -->
		<select
			v-model="mode"
			class="form-select mb-3">
			<option value="all">All Gallery</option>
			<option value="createNew">Create New Gallery</option>
			<option value="addExisting">Add To Existing Gallery</option>
			<option value="update">Update Gallery</option>
			<option value="delete">Delete Gallery</option>
		</select>

		<!-- ================= LOADING ================= -->
		<div
			v-if="loading"
			class="d-flex justify-content-center py-5">
			<div class="spinner-border text-primary"></div>
		</div>

		<!-- ================= ERROR ================= -->
		<div
			v-else-if="error"
			class="text-center py-5">
			<p class="text-danger mb-3">{{ error }}</p>
			<button
				class="btn btn-primary"
				@click="fetchGallery">
				Retry
			</button>
		</div>

		<!-- ================= CONTENT ================= -->
		<template v-else>
			<!-- ================= ALL GALLERIES ================= -->
			<div
				v-if="mode === 'all'"
				class="row">
				<div
					v-if="!galleries.length"
					class="text-center text-muted py-5 col-12">
					No galleries available
				</div>

				<div
					v-for="gallery in galleries"
					:key="gallery.galleryDB_id"
					class="col-12 col-md-6 mb-4">
					<div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
						<!-- ========== CAROUSEL COMPONENT ========== -->
						<GalleryCarousel
							:images="gallery.images"
							:carousel-id="`carousel-${gallery.galleryDB_id}`"
							default-caption="Gallery image" />

						<!-- ========== FOOTER ========== -->
						<div class="card-body bg-white border-top">
							<h3 class="h5 fw-bold mb-1">
								{{ gallery.caption }}
							</h3>

							<p
								v-if="gallery.date"
								class="small text-muted mb-0">
								{{ gallery.date }}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- ================= CREATE NEW ================= -->
			<CreateGallery
				v-if="mode === 'createNew'"
				@created="refreshAndReturn" />

			<!-- ================= ADD EXISTING ================= -->
			<AddExisting
				v-if="mode === 'addExisting'"
				:galleries="galleries"
				@added="refreshAndReturn" />

			<!-- ================= UPDATE ================= -->
			<UpdateGallery
				v-if="mode === 'update'"
				:galleries="galleries"
				@updated="refreshAndReturn" />

			<!-- ================= DELETE ================= -->
			<DeleteGallery
				v-if="mode === 'delete'"
				:galleries="galleries"
				@deleted="refreshAndReturn" />
		</template>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import GalleryCarousel from "./GalleryCarousel.vue";
	import CreateGallery from "./CreateGalleryContent.vue";
	import UpdateGallery from "./UpdateGalleryContent.vue";
	import DeleteGallery from "./DeleteGalleryContent.vue";
	import AddExisting from "./AddToExistingGallery.vue";

	import { type GalleryInterface, type ImageInterface } from "./types";

	/* ================= MODE ================= */
	type Mode = "all" | "createNew" | "addExisting" | "update" | "delete";

	/* ================= STATE ================= */
	const mode = ref<Mode>("all");
	const galleries = ref<GalleryInterface[]>([]);
	const loading = ref<boolean>(false);
	const error = ref<string>("");

	/* ================= INIT ================= */
	onMounted(async function (): Promise<void> {
		await fetchGallery();
	});

	/* ================= FETCH ================= */
	async function fetchGallery(): Promise<void> {
		loading.value = true;
		error.value = "";
		try {
			const res = await fetch("/api/gallery/getAllGallery");
			const data = await res.json();
			if (!res.ok) throw new Error(data.message);
			galleries.value = data.data;
		} catch (err: unknown) {
			error.value =
				err instanceof Error ? err.message : "Failed to load galleries";
		} finally {
			loading.value = false;
		}
	}

	/* ================= REFRESH ================= */
	async function refreshAndReturn(): Promise<void> {
		mode.value = "all";
		await fetchGallery();
	}
</script>
