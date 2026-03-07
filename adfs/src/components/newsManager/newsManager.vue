<template>
	<div>
		<!-- TAB ROW -->
		<div class="row mb-3">
			<div class="col d-flex flex-wrap gap-2">
				<!-- create the tab labels from the tab array of objects -->
				<!-- if the active tab is delete give it a red background -->
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
					<component :is="currentComponent"></component>
				</keep-alive>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";
	import AddNews from "./addNews.vue";
	import UpdateNews from "./updateNews.vue";
	import DeleteNews from "./deleteNews.vue";
	import AllNews from "./allNews.vue";

	const tabs = [
		{ id: "all", label: "past news" },
		{ id: "create", label: "create news" },
		{ id: "update", label: "update news" },
		{ id: "delete", label: "delete news" },
	];

	const activeTab = ref("all");

	const componentMap = {
		all: AllNews,
		create: AddNews,
		update: UpdateNews,
		delete: DeleteNews,
	};

	/* =========================================================
	SETS THE ACTIVE TAB
	========================================================= */

	const setActiveTab = function (tabId) {
		activeTab.value = tabId;
	};

	/* =========================================================
	COMPUTED COMPONENT SWITCHER
	========================================================= */

	const currentComponent = computed(function () {
		return componentMap[activeTab.value];
	});
</script>
