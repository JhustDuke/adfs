<template>
	<div class="row g-3">
		<!-- cards -->
		<div
			v-for="card in cards"
			:key="card.id"
			class="col-md-4">
			<div
				class="card h-100 shadow-sm border-0"
				@click="openModal(card)">
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

	const showModal = ref(false);
	const selectedCard = ref<CardInterface | null>(null);

	const loading = ref(false);
	const errorMessage = ref("");
	const successMessage = ref("");

	/**
	 * fetch all cards
	 */
	const fetchCards = async function (): Promise<void> {
		try {
			const res = await fetch("/api/about/getAllAboutCard");

			const data = await res.json();

			cards.value = data.data || [];
		} catch (error: unknown) {
			console.log("fetch failed"); // early return log
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
	 * handle update from modal
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
				console.log("update failed"); // early return log
				errorMessage.value = result.message;
				return;
			}

			successMessage.value = result.message;

			// 🔥 HARD REFRESH (your requirement)
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
