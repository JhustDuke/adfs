<template>
	<!-- modal container -->
	<div
		v-if="show"
		class="isAbsolute d-flex justify-content-center align-items-center w-100"
		style="inline-size: 0; z-index: 9999; top: 0">
		<!-- backdrop -->
		<div
			class="grey lighten-3"
			style="position: absolute; inset: 0"
			@click="closeModal"></div>
		<!-- modal-->
		<div
			class="isRelative d-flex flex-column p-1 gap-1"
			style="
				width: 92%;
				max-width: 600px;
				border-radius: 10px;
				background: #fff;
				max-height: 90vh;
				overflow-y: auto;
				z-index: 10000;
			">
			<!-- HEADER -->
			<div class="d-flex justify-content-between align-items-center">
				<h5 class="blue-text text-darken-3 m-0">Preview</h5>
				<button
					class="btn-close"
					@click="closeModal"></button>
			</div>
			<!-- ERROR -->
			<div
				v-if="errorMessage"
				class="red lighten-4 red-text text-darken-3 p-2 rounded">
				{{ errorMessage }}
			</div>
			<!-- SUCCESS -->
			<div
				v-if="successMessage"
				class="green lighten-4 green-text text-darken-3 p-2 rounded">
				{{ successMessage }}
			</div>
			<!-- CARD -->
			<div
				class="card h-100 shadow-sm border-0"
				:class="bgColor">
				<div class="position-relative">
					<img
						:src="imageSrc"
						:alt="title"
						class="card-img-top"
						style="height: 220px; object-fit: cover" />
					<div
						class="position-absolute bottom-0 start-0 p-3 w-100"
						style="
							background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
						">
						<h5 class="fw-bold text-white mb-0 text-uppercase">{{ title }}</h5>
					</div>
				</div>
				<div class="card-body position-relative">
					<div>{{ expanded ? textContent : textContent.slice(0, 120) }}</div>
					<div
						v-if="!expanded"
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
				<div class="card-footer bg-transparent border-0 pt-0 pb-4 px-4">
					<button
						class="btn btn-link p-0 fw-bold text-primary"
						style="text-decoration: none; border: none; background: none"
						@click="toggleExpand">
						{{ expanded ? "Read Less" : "Read More" }}
					</button>
				</div>
			</div>
			<!-- CONFIRM -->
			<button
				class="btn btn-primary w-100"
				:disabled="loading"
				@click="confirm">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"></span>
				{{ loading ? "Loading..." : "Confirm" }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	const props = defineProps<{
		show: boolean;
		title: string;
		textContent: string;
		imageSrc: string;
		bgColor?: string;
		loading?: boolean;
		errorMessage?: string;
		successMessage?: string;
	}>();
	const emit = defineEmits(["close", "confirm"]);
	const expanded = ref(false);
	const closeModal = function (): void {
		emit("close");
	};
	const confirm = function (): void {
		emit("confirm");
	};
	const toggleExpand = function (): void {
		expanded.value = !expanded.value;
	};
</script>
