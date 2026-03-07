<template>
	<div>
		<!-- TAB ROW -->
		<div class="row mb-3">
			<div class="col d-flex flex-wrap gap-2">
				<button
					v-for="tab in tabs"
					:key="tab.id"
					class="btn text-capitalize"
					:class="{
						'grey lighten-2': activeTab === tab.id && tab.id !== 'delete',
						'red lighten-2 white-text':
							activeTab === tab.id && tab.id === 'delete',
					}"
					@click="setActiveTab(tab.id)">
					{{ tab.label }}
				</button>
			</div>
		</div>

		<div class="row g-4">
			<main class="col-12 col-lg-9">
				<!-- dynamic component switcher -->
				<keep-alive>
					<component :is="currentComponent" />
				</keep-alive>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";

	import AddGallery from "./addGalleryContent.vue";
	import UpdateGallery from "./updateGalleryContent.vue";
	import DeleteGallery from "./deleteGalleryContent.vue";
	import AllGallery from "./allGalleryContent.vue";

	const tabs = [
		{ id: "all", label: "all contents" },
		{ id: "create", label: "add contents" },
		{ id: "update", label: "update contents" },
		{ id: "delete", label: "delete content" },
	];

	const activeTab = ref("all");

	/* =========================================================
	COMPONENT MAP
	maps tab id → gallery manager component
	========================================================= */

	const componentMap = {
		all: AllGallery,
		create: AddGallery,
		update: UpdateGallery,
		delete: DeleteGallery,
	};

	/* =========================================================
	TAB SWITCHER
	========================================================= */

	const setActiveTab = function (tabId) {
		activeTab.value = tabId;
	};

	const currentComponent = computed(function () {
		return componentMap[activeTab.value];
	});
</script>
