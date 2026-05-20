<template>
	<div
		v-if="show"
		class="custom-modal">
		<div
			class="custom-modal-backdrop"
			@click="close"></div>

		<div
			class="custom-modal-content z-depth-3"
			style="max-height: 85vh; overflow-y: auto">
			<div class="d-flex justify-content-between mb-3">
				<h5 class="blue-text text-darken-3">Preview</h5>
				<button
					class="btn-close"
					@click="close"></button>
			</div>

			<!-- ERROR -->
			<div
				v-if="errorMessage"
				class="red lighten-4 red-text text-darken-3 p-2 mb-3 rounded">
				{{ errorMessage }}
			</div>

			<!-- SUCCESS -->
			<div
				v-if="successMessage"
				class="green lighten-4 green-text text-darken-3 p-2 mb-3 rounded">
				{{ successMessage }}
			</div>

			<!-- CARD -->
			<div
				class="card border-0 shadow-sm"
				:class="bgClass">
				<img
					:src="imageSrc"
					class="card-img-top"
					style="height: 220px; object-fit: cover" />

				<div class="card-body">
					<h5 :class="['fw-bold text-uppercase', captionClass]">
						{{ caption }}
					</h5>

					<p class="text-muted">
						{{ excerpts }}
					</p>
				</div>
			</div>

			<!-- ACTION -->
			<button
				class="btn btn-primary w-100 mt-3"
				:disabled="loading"
				@click="confirm">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"></span>

				{{ loading ? "Creating..." : "Confirm" }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { resolveTextClass, resolveBgClass } from "./normalizeColors";

const props = defineProps<{
	show: boolean;
	caption: string;
	excerpts: string;
	imageSrc: string;
	captionColor: string;
	bgColor: string;
	loading: boolean;
	errorMessage: string;
	successMessage: string;
}>();

const emit = defineEmits(["close", "confirm"]);

function close(): void {
	emit("close");
}

function confirm(): void {
	if (props.loading) return;
	emit("confirm");
}

/* refactored: using shared resolver */
const captionClass = computed(function () {
	return resolveTextClass(props.captionColor);
});

/* refactored: using shared resolver */
const bgClass = computed(function () {
	return resolveBgClass(props.bgColor);
});
</script>
<style scoped>
	.custom-modal {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
	}

	.custom-modal-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	.custom-modal-content {
		position: relative;
		background: white;
		padding: 2rem;
		border-radius: 10px;
		width: 90%;
		max-width: 600px;
		z-index: 2001;
	}
</style>
