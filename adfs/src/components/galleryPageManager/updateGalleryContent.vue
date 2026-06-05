<template>
	<div class="p-2">
		<select
			v-model="selected"
			class="form-select mb-3">
			<option
				disabled
				value=""
				>Select a gallery to update</option
			>
			<option
				v-for="g in galleries"
				:key="g.galleryDB_id"
				:value="g">
				{{ g.caption }}
			</option>
		</select>

		<GalleryFormBase
			v-if="selected"
			:model-value="{ caption: selected.caption, images: selected.images }"
			submit-label="Update Gallery"
			@submit="submit" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import GalleryFormBase from "./GalleryForm.vue";

	const props = defineProps<{ galleries: any[] }>();
	const emit = defineEmits<{ updated: [] }>();

	const selected = ref<any>("");

	function submit(payload: any): void {
		console.log("UPDATE:", {
			id: selected.value.galleryDB_id,
			...payload,
		});
		emit("updated");
	}
</script>
