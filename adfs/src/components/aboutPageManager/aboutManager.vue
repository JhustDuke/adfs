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
				<keep-alive>
					<component :is="currentComponent"></component>
				</keep-alive>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";

	import AddAboutCard from "./addCard/addAboutCard.vue";
	import AllAboutCards from "./allAboutCards.vue";
	// import UpdateAboutCard from "./updateAboutCard.vue";
	// import DeleteAboutCard from "./deleteAboutCard.vue";

	const tabs = [
		{ id: "all", label: "about cards" },
		{ id: "create", label: "create card" },
		{ id: "update", label: "update card" },
		{ id: "delete", label: "delete card" },
	];

	const activeTab = ref("all");

	const componentMap = {
		all: AllAboutCards,
		create: AddAboutCard,
		// update: UpdateAboutCard,
		// delete: DeleteAboutCard,
	};

	const setActiveTab = function (tabId) {
		activeTab.value = tabId;
	};

	const currentComponent = computed(function () {
		return componentMap[activeTab.value];
	});
</script>
