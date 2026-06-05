<template>
	<GalleryFormBase
		:submit-label="'Create Gallery'"
		@submit="submit" />
</template>

<script setup lang="ts">
	import GalleryFormBase from "./GalleryForm.vue";

	function submit(payload: any): void {
		console.log("CREATE:", payload);
	}
</script>
