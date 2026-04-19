<template>
	<!-- MAIN DASHBOARD LAYOUT -->
	<div class="container-fluid py-4">
		<div class="row g-4">
			<!-- aside bar for md screens -->
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
			<main class="col-12 col-lg-9 black">
				<div
					class="card shadow-sm border-0"
					style="height: 400px; overflow-y: scroll">
					<!-- dynamic mounted components -->
					<center class="p-3">
						<keep-alive>
							<component :is="currentComponent"></component>
						</keep-alive>
					</center>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from "vue";

	import NewsManager from "./newsManager/newsManager.vue";
	import AcademicsManager from "./academicPageManager/academicManager.vue";
	import GalleryManager from "./galleryPageManager/galleryManager.vue";
	import AboutManager from "./aboutPageManager/aboutManager.vue";

	const tabs = [
		{ id: "news", label: "News page" },
		{ id: "academics", label: "Academic Page" },
		{ id: "gallery", label: "Gallery page" },
		{ id: "about", label: "about page" },
	];

	//news is selected as the active component
	const activeTab = ref("news");

	//all the mountable components on the dashboard
	const componentMap = {
		news: NewsManager,
		academics: AcademicsManager,
		gallery: GalleryManager,
		about: AboutManager,
	};

	const setActiveTab = function (tabId) {
		activeTab.value = tabId;
	};

	//this code auto switches component based on the activeTabValue
	const currentComponent = computed(function () {
		return componentMap[activeTab.value];
	});

	//this would only work for mobile screens select
	const handleTabChange = function (event) {
		activeTab.value = event.target.value;
	};
</script>
