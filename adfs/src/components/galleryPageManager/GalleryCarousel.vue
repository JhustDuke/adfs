<template>
	<div
		:id="carouselId"
		class="carousel slide"
		data-bs-ride="carousel">
		<!-- ================= ITEMS ================= -->
		<div class="carousel-inner">
			<div
				v-for="(image, index) in images"
				:key="image.url + index"
				:class="['carousel-item', { active: index === 0 }]">
				<div class="ratio ratio-4x3">
					<img
						:src="image.url"
						:alt="image.subCaption || defaultCaption"
						class="d-block w-100 object-fit-cover"
						loading="lazy" />

					<div
						class="carousel-caption d-block bg-dark bg-opacity-50 rounded px-2 py-1 mb-2 mx-2">
						<p class="small m-0 text-white">
							{{ image.subCaption || defaultCaption }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- ================= CONTROLS ================= -->
		<template v-if="images.length > 1">
			<button
				class="carousel-control-prev"
				type="button"
				:data-bs-target="`#${carouselId}`"
				data-bs-slide="prev">
				<span class="carousel-control-prev-icon"></span>
			</button>

			<button
				class="carousel-control-next"
				type="button"
				:data-bs-target="`#${carouselId}`"
				data-bs-slide="next">
				<span class="carousel-control-next-icon"></span>
			</button>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { type ImageInterface } from "./types";

	/* ================= PROPS ================= */
	const props = defineProps<{
		images?: ImageInterface[];
		carouselId?: string;
		defaultCaption?: string;
	}>();

	/* ================= FALLBACKS ================= */
	const images = props.images ?? [];

	const carouselId =
		props.carouselId ?? `carousel-${Math.random().toString(36).slice(2)}`;

	const defaultCaption = props.defaultCaption ?? "Image";
</script>
