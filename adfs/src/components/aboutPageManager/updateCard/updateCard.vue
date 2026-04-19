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
			v-else-if="errorMessage"
			class="col-12 text-center red-text text-darken-3">
			{{ errorMessage }}
		</div>

		<!-- empty state -->
		<div
			v-else-if="cards.length === 0"
			class="col-12 text-center text-muted p-5">
			No cards to display
		</div>

		<!-- cards -->
		<div
			v-else
			v-for="card in cards"
			:key="card.id"
			class="col-md-4">
			<div
				class="card h-100 shadow-sm border-0"
				@click="openModal(card)"
				style="cursor: pointer">
				<div class="position-relative">
					<img
						:src="card.imageSrc"
						class="card-img-top"
						style="height: 220px; object-fit: cover" />

					<div
						class="position-absolute bottom-0 start-0 p-3 w-100"
						style="
							background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
						">
						<h5 class="text-white fw-bold text-uppercase">
							{{ card.title }}
						</h5>
					</div>
				</div>

				<div class="card-body"> {{ card.textContent.slice(0, 120) }}... </div>
			</div>
		</div>

		<!-- MODAL -->
		<UpdatePreviewModal
			:show="showModal"
			:card="selectedCard"
			:loading="loading"
			:errorMessage="errorMessage"
			:successMessage="successMessage"
			@close="closeModal"
			@confirm="handleUpdate" />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import UpdatePreviewModal from "./updateCardPreviewModal.vue";

	type CardInterface = {
		id: number;
		title: string;
		textContent: string;
		imageSrc: string;
	};

	const cards = ref<CardInterface[]>([]);
	const cardsLoading = ref(false);

	const showModal = ref(false);
	const selectedCard = ref<CardInterface | null>(null);

	const loading = ref(false);
	const errorMessage = ref("");
	const successMessage = ref("");

	/**
	 * fetch all cards
	 */
	const fetchCards = async function (): Promise<void> {
		cardsLoading.value = true;
		errorMessage.value = "";

		try {
			const res = await fetch("/api/about/getAllAboutCard");
			const data = await res.json();

			if (!res.ok) {
				errorMessage.value = data.message;
				return;
			}

			cards.value = data.data || [];
		} catch (error: unknown) {
			const err = error as Error;
			errorMessage.value = err.message || "fetch failed";
		} finally {
			cardsLoading.value = false;
		}
	};

	/**
	 * open modal
	 */
	const openModal = function (card: CardInterface): void {
		selectedCard.value = card;
		showModal.value = true;
	};

	/**
	 * close modal
	 */
	const closeModal = function (): void {
		showModal.value = false;
		selectedCard.value = null;
	};

	/**
	 * handle update
	 */
	const handleUpdate = async function (formData: FormData): Promise<void> {
		loading.value = true;
		errorMessage.value = "";
		successMessage.value = "";

		try {
			const res = await fetch("/api/about/updateAboutCard", {
				method: "PATCH",
				body: formData,
			});

			const result = await res.json();

			if (!res.ok) {
				errorMessage.value = result.message;
				return;
			}

			successMessage.value = result.message;

			window.location.reload();
		} catch (error: unknown) {
			const err = error as Error;
			errorMessage.value = err.message;
		} finally {
			loading.value = false;

			setTimeout(function () {
				errorMessage.value = "";
			}, 5000);
		}
	};

	onMounted(function () {
		fetchCards();
	});
</script>
