<template>
	<!-- MAIN DASHBOARD LAYOUT -->
	<div class="container-fluid py-4">
		<div class="row g-4">
			<!-- ==============================
			SIDEBAR
			============================== -->
			<aside class="col-12 col-lg-3">
				<!-- MOBILE SELECT -->
				<div class="d-lg-none mb-3">
					<label class="fw-bold small grey-text text-darken-1">
						SELECT SECTION
					</label>

					<select
						class="form-select border-2"
						:value="activeTab"
						@change="handleTabChange">
						<option
							v-for="tab in tabs"
							:key="tab.id"
							:value="tab.id">
							{{ tab.label }}
						</option>
					</select>
				</div>

				<!-- DESKTOP SIDEBAR -->
				<div class="card border-0 shadow-sm d-none d-lg-block">
					<div class="card-header indigo darken-4 white-text"> Management </div>

					<div class="list-group list-group-flush">
						<button
							v-for="tab in tabs"
							:key="tab.id"
							@click="setActiveTab(tab.id)"
							class="list-group-item list-group-item-action"
							:class="{ 'grey lighten-2': activeTab === tab.id }">
							{{ tab.label }}
						</button>
					</div>
				</div>
			</aside>

			<!-- ==============================
			MAIN CONTENT AREA
			============================== -->
			<main class="col-12 col-lg-9">
				<div class="card shadow-sm border-0">
					<div
						class="card-body p-2"
						style="height: 400px; overflow-y: scroll">
						<!--
						DYNAMIC COMPONENT
						loads the manager responsible for the selected tab
						-->
						<keep-alive>
							<component :is="currentComponent"></component>
						</keep-alive>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";

	/* =========================================================
MANAGER COMPONENTS
each component manages its own CRUD logic
========================================================= */

	import NewsManager from "./newsManager/newsManager.vue";
	import AcademicsManager from "./academicPageManager/academicManager.vue";
	import GalleryManager from "./galleryPageManager/galleryManager.vue";

	/* =========================================================
DASHBOARD STATE
========================================================= */

	const activeTab = ref("news");

	/* =========================================================
TAB CONFIGURATION
drives the sidebar navigation
========================================================= */

	const tabs = [
		{ id: "news", label: "News page" },
		{ id: "academics", label: "Academic Page" },
		{ id: "gallery", label: "Gallery page" },
	];

	/* =========================================================
COMPONENT MAP
maps tab id → manager component
========================================================= */

	const componentMap = {
		news: NewsManager,
		academics: AcademicsManager,
		gallery: GalleryManager,
	};

	/* =========================================================
EVENT HANDLERS
========================================================= */

	const handleTabChange = function (event) {
		activeTab.value = event.target.value;
	};

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
