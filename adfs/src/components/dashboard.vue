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
					<!-- MOBILE LOGOUT BUTTON -->
					<button
						@click="handleLogout"
						class="btn btn-outline-danger btn-sm w-100 mt-2"
						:disabled="isLoggingOut">
						<span
							v-if="isLoggingOut"
							class="spinner-border spinner-border-sm me-1"></span>
						{{ isLoggingOut ? "Logging out..." : "Logout" }}
					</button>
				</div>
				<!-- DESKTOP SIDEBAR -->
				<div class="card border-0 shadow-sm d-none d-lg-block">
					<div class="card-header indigo darken-4 white-text"> Management </div>
					<div class="list-group list-group-flush">
						<button
							v-for="tab in tabs"
							:key="tab.id"
							@click="setActiveTab(tab.id)"
							class="list-group-item list-group-item-action text-capitalize"
							:class="{ 'grey lighten-2': activeTab === tab.id }">
							{{ tab.label }}
						</button>
						<!-- DESKTOP LOGOUT BUTTON -->
						<button
							@click="handleLogout"
							class="list-group-item list-group-item-action text-danger fw-bold"
							:disabled="isLoggingOut">
							<span
								v-if="isLoggingOut"
								class="spinner-border spinner-border-sm me-1"></span>
							<i
								v-else
								class="bi bi-box-arrow-right me-2"></i>
							{{ isLoggingOut ? "Logging out..." : "Logout" }}
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
				<analytics />
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import NewsManager from "./newsManager/newsManager.vue";
	import AcademicsManager from "./academicPageManager/academicManager.vue";
	import GalleryManager from "./galleryPageManager/galleryManager.vue";
	import AboutManager from "./aboutPageManager/aboutManager.vue";
	import staffManager from "./staffManager/StaffManager.vue";
	import Analytics from "./analytics.vue";

	const tabs = [
		{ id: "academics", label: "Academic Page" },
		{ id: "about", label: "about page" },
		{ id: "gallery", label: "Gallery page" },
		{ id: "staffs", label: "staff card" },
		{ id: "news", label: "News page" },
	];

	/* =========================================================
 ACTIVE TAB STATE
 news is selected as the default active component
 ========================================================= */
	const activeTab = ref("news");

	/* =========================================================
 LOGOUT STATE
 Controls the loading spinner on the logout button
 ========================================================= */
	const isLoggingOut = ref(false);

	/* =========================================================
 COMPONENT MAP
 All mountable components on the dashboard
 ========================================================= */
	const componentMap = {
		academics: AcademicsManager,
		about: AboutManager,
		gallery: GalleryManager,
		staffs: staffManager,
		news: NewsManager,
	};

	const setActiveTab = function (tabId: any) {
		activeTab.value = tabId;
	};

	/* =========================================================
 CURRENT COMPONENT
 Auto switches component based on the activeTab value
 ========================================================= */

	const currentComponent = computed(function () {
		// @ts-ignore
		return componentMap[activeTab.value];
	});

	/* =========================================================
 HANDLE TAB CHANGE
 Only works for mobile screen select
 ========================================================= */
	const handleTabChange = function (event: any) {
		activeTab.value = event.target.value;
	};

	/* =========================================================
 LOGOUT HANDLER
 Calls the logout endpoint, clears the session cookie
 server-side, then redirects to /login
 ========================================================= */
	const handleLogout = async function () {
		isLoggingOut.value = true;
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			window.location.href = "/login";
		} catch (err: any) {
			console.log("log out error:", err.message);
			isLoggingOut.value = false; // r
		}
	};
</script>
