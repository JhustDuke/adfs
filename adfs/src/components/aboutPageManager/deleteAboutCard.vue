<template>
	<div class="row g-3 py-4">
		<!-- LOADING -->
		<div
			v-if="isFetching"
			class="text-center w-100 my-5">
			<div class="spinner-border text-primary"></div>
			<p class="mt-2 text-muted">Loading cards...</p>
		</div>

		<!-- ERROR -->
		<div
			v-else-if="fetchError"
			class="text-center w-100 my-5 red-text text-darken-2 fw-bold">
			Unable to load about cards
		</div>

		<!-- EMPTY -->
		<div
			v-else-if="cards.length === 0"
			class="text-center text-muted w-100">
			No cards available
		</div>

		<!-- CARDS -->
		<div
			v-else
			v-for="card in cards"
			:key="card.id"
			class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
			<div
				class="card shadow-sm border-0 h-100"
				style="max-width: 350px; cursor: pointer"
				@click="openDeleteBox(card)">
				<img
					:src="card.imageSrc"
					class="card-img-top"
					style="height: 200px; object-fit: cover" />

				<div class="card-body">
					<h5 class="blue-text text-darken-3 text-uppercase">
						{{ card.title }}
					</h5>

					<p class="text-muted"> {{ card.textContent.slice(0, 100) }}... </p>
				</div>
			</div>
		</div>

		<!-- DELETE CONFIRM MODAL -->
		<div
			v-if="showDeleteBox"
			class="delete-overlay">
			<div class="delete-box z-depth-3">
				<h5 class="red-text text-darken-2">
					Delete "{{ selectedCard?.title }}"?
				</h5>

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

		<!-- SUCCESS MESSAGE -->
		<div
			v-if="successMessage"
			class="green lighten-4 green-text text-darken-3 p-3 mt-3 rounded text-center w-100">
			{{ successMessage }}
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";

	type CardInterface = {
		id: number;
		title: string;
		textContent: string;
		imageSrc: string;
	};

	const cards = ref<CardInterface[]>([]);
	const isFetching = ref(true);
	const fetchError = ref(false);

	const showDeleteBox = ref(false);
	const selectedCard = ref<CardInterface | null>(null);
	const successMessage = ref("");

	/**
	 * fetch cards
	 */
	const fetchCards = async function (): Promise<void> {
		try {
			isFetching.value = true;

			const res = await fetch("/api/about/getAllAboutCard");
			const data = await res.json();

			if (!res.ok) {
				fetchError.value = true;
				return;
			}

			cards.value = data.data || [];
		} catch {
			fetchError.value = true;
		} finally {
			isFetching.value = false;
		}
	};

	onMounted(function () {
		fetchCards();
	});

	/**
	 * open delete box
	 */
	const openDeleteBox = function (card: CardInterface): void {
		selectedCard.value = card;
		showDeleteBox.value = true;
	};

	/**
	 * close delete box
	 */
	const closeDeleteBox = function (): void {
		showDeleteBox.value = false;
		selectedCard.value = null;
	};

	/**
	 * delete handler
	 */
	const handleDelete = async function (): Promise<void> {
		if (!selectedCard.value) return;

		try {
			const res = await fetch("/api/about/deleteAboutCard", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: selectedCard.value.id,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data?.message || "Delete failed");
				return;
			}

			successMessage.value = "Deleted successfully";

			closeDeleteBox();

			// refresh after 3 seconds
			setTimeout(function () {
				window.location.reload();
			}, 3000);
		} catch {
			alert("Network error");
		}
	};
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
