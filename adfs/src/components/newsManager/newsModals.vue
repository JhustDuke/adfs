<template>
	<div
		class="card shadow h-100"
		style="max-width: 350px; cursor: pointer">
		<div
			class="card-body d-flex flex-column"
			@click="openModal">
			<h5 class="card-title">
				{{ news.title }}
			</h5>

			<small class="text-muted mb-2">
				{{ news.date }}
			</small>

			<span
				v-if="news.category"
				class="badge mb-2"
				:class="news.badgeColor || 'bg-primary'">
				{{ news.category }}
			</span>

			<p class="card-text">
				{{ news.excerpt }}
			</p>
		</div>

		<!-- CUSTOM MODAL -->

		<div
			v-if="showModal"
			class="custom-modal">
			<div
				class="custom-modal-backdrop"
				@click="closeModal"></div>

			<div class="custom-modal-content">
				<div class="d-flex justify-content-between mb-3">
					<h5>{{ news.title }}</h5>

					<button
						class="btn-close"
						@click="closeModal"></button>
				</div>

				<p>
					<strong>Date:</strong>
					{{ news.date }}
				</p>

				<p v-if="news.category">
					<strong>Category:</strong>
					{{ news.category }}
				</p>

				<hr />

				<p>
					{{ news.fullText }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import type { newsCardInterface } from "../../interfaces";

	const props = defineProps<{
		news: newsCardInterface;
	}>();

	const showModal = ref<boolean>(false);

	/**
	 * opens modal
	 */
	const openModal = function (): void {
		showModal.value = true;
	};

	/**
	 * closes modal
	 */
	const closeModal = function (): void {
		showModal.value = false;
	};
</script>

<style scoped>
	.custom-modal {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1050;
	}

	.custom-modal-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.custom-modal-content {
		position: relative;
		background: white;
		padding: 25px;
		border-radius: 8px;
		max-width: 700px;
		width: 90%;
		z-index: 1051;
	}
</style>
