<template>
	<div class="row g-3">
		<!-- loading -->
		<div
			v-if="cardsLoading"
			class="col-12 text-center p-5">
			<div class="spinner-border"></div>
		</div>

		<!-- error -->
		<div
			v-else-if="error"
			class="col-12 text-center red-text text-darken-3">
			{{ error }}
		</div>

		<!-- empty -->
		<div
			v-else-if="cards.length === 0"
			class="col-12 text-center text-muted p-5">
			No about cards found
		</div>

		<!-- cards -->
		<div
			v-else
			v-for="card in cards"
			:key="card.id"
			class="col-md-4">
			<div
				class="card h-100 shadow-sm border-0"
				style="cursor: pointer"
				@click="openPreview(card)">
				<img
					:src="card.imageSrc"
					class="card-img-top"
					style="height: 220px; object-fit: cover" />

				<div class="card-body">
					<h5 class="fw-bold mb-2">
						{{ card.title }}
					</h5>

					<p class="text-muted mb-0">
						{{ card.textContent.slice(0, 120) }}...
					</p>
				</div>
			</div>
		</div>

		<!-- MODAL -->
		<UpdateAcademicPreview
			:show="showPreview"
			:card="selectedCard"
			:loading="loading"
			:errorMessage="error"
			:successMessage="success"
			@close="closePreview"
			@confirm="submit" />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import UpdateAcademicPreview from "./updateAcademicPreview.vue";

	type AboutCardInterface = {
		id: number;
		title: string;
		textContent: string;
		imageSrc: string;
	};

	const cards = ref<AboutCardInterface[]>([]);

	const cardsLoading = ref(false);

	const showPreview = ref(false);

	const selectedCard = ref<AboutCardInterface | null>(null);

	const loading = ref(false);

	const error = ref("");
	const success = ref("");

	/**
	 * fetch all about cards
	 */
	async function fetchCards(): Promise<void> {
		cardsLoading.value = true;

		error.value = "";

		try {
			const res = await fetch("/api/academic/getAllAcademicCard");

			const data = await res.json();

			if (!res.ok) {
				error.value = data.message || "failed to fetch cards";

				console.log("fetch cards failed");

				return;
			}

			cards.value = data.data || [];
		} catch (e: unknown) {
			const err = e as Error;

			error.value = err.message || "fetch failed";
		} finally {
			cardsLoading.value = false;
		}
	}

	/**
	 * submit update
	 */
	async function submit(formData: FormData): Promise<void> {
		if (loading.value) {
			console.log("update already running");

			return;
		}

		loading.value = true;

		error.value = "";
		success.value = "";

		try {
			const res = await fetch("/api/academic/updateAcademicCard", {
				method: "PATCH",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok) {
				error.value = data.message || "update failed";

				console.log("update request failed");

				return;
			}

			success.value = data.message || "updated successfully";

			setTimeout(function (): void {
				success.value = "";

				window.location.reload();
			}, 3000);
		} catch (e: unknown) {
			const err = e as Error;

			error.value = err.message || "update failed";
		} finally {
			loading.value = false;

			setTimeout(function (): void {
				error.value = "";
			}, 5000);
		}
	}
	/**
	 * open preview
	 */
	function openPreview(card: AboutCardInterface): void {
		selectedCard.value = card;

		showPreview.value = true;
	}

	/**
	 * close preview
	 */
	function closePreview(): void {
		showPreview.value = false;

		selectedCard.value = null;
	}

	onMounted(function (): void {
		fetchCards();
	});
</script>
