<template>
	<div
		v-if="show"
		class="custom-modal">
		<div
			class="custom-modal-backdrop"
			@click="closeModal"></div>

		<div class="custom-modal-content z-depth-3">
			<!-- header -->
			<div class="d-flex justify-content-between mb-3">
				<h5 class="blue-text text-darken-3">Edit Card</h5>
				<button
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<!-- error -->
			<div
				v-if="errorMessage"
				class="red lighten-4 red-text text-darken-3 p-2 mb-3 rounded">
				{{ errorMessage }}
			</div>

			<!-- success -->
			<div
				v-if="successMessage"
				class="green lighten-4 green-text text-darken-3 p-2 mb-3 rounded">
				{{ successMessage }}
			</div>

			<!-- scroll body -->
			<div class="modal-body-scroll">
				<!-- IMAGE -->
				<div
					v-if="activeImage"
					class="mb-3">
					<img
						:src="activeImage"
						class="preview-img" />
				</div>

				<!-- FILE -->
				<div class="mb-3">
					<label class="form-label">Change Image (optional)</label>
					<input
						class="form-control"
						type="file"
						@change="handleFileChange" />
				</div>

				<!-- TITLE -->
				<div class="mb-3">
					<label class="form-label">Title</label>
					<input
						v-model="localTitle"
						type="text"
						class="form-control" />
				</div>

				<!-- TEXT -->
				<div class="mb-3">
					<label class="form-label">Text Content</label>
					<textarea
						v-model="localTextContent"
						rows="6"
						class="form-control"></textarea>
				</div>
			</div>

			<!-- ACTION -->
			<button
				class="btn btn-primary w-100 mt-3"
				@click="confirmUpdate"
				:disabled="loading">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"></span>

				{{ loading ? "Updating..." : "Save Changes" }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from "vue";

	type CardInterface = {
		id: number;
		title: string;
		textContent: string;
		imageSrc: string;
	};

	const props = defineProps<{
		show: boolean;
		card: CardInterface | null;

		loading: boolean;
		errorMessage: string;
		successMessage: string;
	}>();

	const emit = defineEmits<{
		(e: "close"): void;
		(e: "confirm", payload: FormData): void;
	}>();

	const localTitle = ref("");
	const localTextContent = ref("");
	const newImageFile = ref<File | null>(null);

	/**
	 * sync from parent
	 */
	watch(
		() => props.card,
		function (newCard) {
			if (!newCard) {
				console.log("no card provided");
				return;
			}

			localTitle.value = newCard.title;
			localTextContent.value = newCard.textContent;

			newImageFile.value = null;
		}
	);

	/**
	 * preview only new image
	 */
	const activeImage = computed(function () {
		if (!newImageFile.value) return null;
		return URL.createObjectURL(newImageFile.value);
	});

	/**
	 * file handler
	 */
	const handleFileChange = function (event: Event): void {
		const target = event.target as HTMLInputElement;

		if (!target.files || target.files.length === 0) {
			console.log("no file selected");
			return;
		}

		newImageFile.value = target.files[0];
	};

	/**
	 * emit update intent only
	 */
	const confirmUpdate = function (): void {
		if (!props.card) {
			console.log("missing card");
			return;
		}

		const formData = new FormData();
		formData.append("id", String(props.card.id));
		formData.append("caption", localTitle.value);
		formData.append("excerpts", localTextContent.value);

		if (newImageFile.value) {
			formData.append("image", newImageFile.value);
		}

		emit("confirm", formData);
	};

	/**
	 * close
	 */
	const closeModal = function (): void {
		emit("close");
	};
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
		padding: 1.5rem;
		border-radius: 10px;
		width: 90%;
		max-width: 600px;
		z-index: 2001;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.modal-body-scroll {
		overflow-y: auto;
		max-height: 65vh;
		padding-right: 5px;
	}

	.preview-img {
		width: 100%;
		height: 220px;
		object-fit: cover;
		border-radius: 8px;
	}
</style>
