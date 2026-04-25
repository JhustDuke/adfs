<template>
	<div class="row g-3">
		<!-- loading state -->
		<div
			v-if="loading"
			class="col-12 text-center p-5">
			<div
				class="spinner-border"
				role="status"></div>
		</div>

		<!-- error state -->
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

		<!-- cards list -->
		<div
			v-else
			v-for="(card, index) in cards"
			:key="card.id"
			class="col-md-4">
			<div class="card h-100 shadow-sm border-0">
				<!-- image + title -->
				<div class="position-relative">
					<img
						:src="card.imageSrc"
						:alt="card.title"
						class="card-img-top"
						style="height: 220px; object-fit: cover" />

					<div
						class="position-absolute bottom-0 start-0 p-3 w-100"
						style="
							background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
						">
						<h5
							class="fw-bold text-white mb-0 text-uppercase"
							:class="card.textCaptionColor">
							{{ card.title }}
						</h5>
					</div>
				</div>

				<!-- text -->
				<div
					class="card-body position-relative"
					:class="card.bgColor">
					<div>
						{{
							isExpanded(card.id)
								? card.textContent
								: card.textContent.slice(0, 120)
						}}
					</div>

					<div
						v-if="!isExpanded(card.id)"
						class="position-absolute bottom-0 start-0 w-100"
						style="
							height: 45px;
							background: linear-gradient(
								transparent,
								rgba(255, 255, 255, 0.8)
							);
						">
					</div>
				</div>

				<!-- toggle -->
				<div class="card-footer bg-transparent border-0 pt-0 pb-4 px-4">
					<button
						class="btn btn-link p-0 fw-bold text-primary"
						style="text-decoration: none; border: none; background: none"
						@click="toggleExpand(card.id)">
						{{ isExpanded(card.id) ? "Read Less" : "Read More" }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";

	interface CardInterface {
		id: number;
		title: string;
		textContent: string;
		imageSrc: string;
		textCaptionColor: string;
		bgColor: string;
	}

	onMounted(function () {
		fetchCards();
	});
	
	const cards = ref<CardInterface[]>([]);
	const expandedCardId = ref<number | null>(null);

	const loading = ref<boolean>(false);
	const errorMessage = ref<string>("");

	

	const fetchCards = async function (): Promise<void> {
		loading.value = true;
		errorMessage.value = "";

		try {
			const response = await fetch("/api/academic/getAllAcademicCard");
			const result: { message: string; data: CardInterface[] } =
				await response.json();

			if (!response.ok) {
				console.log("fetch failed");
				errorMessage.value = result.message;
				return;
			}

			cards.value = result.data || [];
		} catch (error: unknown) {
			const err = error as Error;
			errorMessage.value = err.message || "couldn't fetch resources";
		} finally {
			loading.value = false;
		}
	};

	

	const isExpanded = function (id: number): boolean {
		return expandedCardId.value === id;
	};

	const toggleExpand = function (id: number): void {
		if (expandedCardId.value === id) {
			console.log("collapsing card");
			expandedCardId.value = null;
			return;
		}

		expandedCardId.value = id;
	};
</script>
