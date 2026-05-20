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
	import AddContent from "./createAcademicCard/createAcademicContent.vue";
	import DeleteContent from "./delAcademicContent.vue";
	import UpdateContent from "./updateAcademicCard/updateAcademic.vue";
	import AllContent from "./allAcademicContent.vue";

	const tabs = [
		{ id: "all", label: "all info" },
		{ id: "create", label: "create new info" },
		{ id: "update", label: "update info" },
		{ id: "delete", label: "delete info" },
	];

	const activeTab = ref("all");

	//all the components useds
	const componentMap = {
		all: AllContent,
		create: AddContent,
		update: UpdateContent,
		delete: DeleteContent,
	};

	//this sets the active tab
	const setActiveTab = function (tabId) {
		activeTab.value = tabId;
	};

	//the switches the current tab based on the activeTabValue
	const currentComponent = computed(function () {
		return componentMap[activeTab.value];
	});
</script>
