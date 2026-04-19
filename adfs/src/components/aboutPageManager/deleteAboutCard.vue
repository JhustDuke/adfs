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
				@click="confirmDelete(card)">
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

	/**
	 * GET ALL CARDS
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
	 * DELETE CARD
	 */
	const confirmDelete = async function (card: CardInterface): Promise<void> {
		const ok = window.confirm(
			`Delete "${card.title}"? This action cannot be undone.`
		);

		if (!ok) return;

		try {
			const res = await fetch("/api/about/deleteAboutCard", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: card.id }),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data?.message || "Delete failed");
				return;
			}

			window.location.reload();
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
</style>
