<template>
	<!-- MAIN PAGE CONTAINER -->
	<div class="container-fluid py-4">
		<!-- ROW FOR SIDEBAR + MAIN CONTENT -->
		<div class="row g-4">
			<!-- ======================================================
          SIDEBAR SECTION (ACTION SELECTOR)
          ====================================================== -->
			<aside class="col-12 col-lg-3">
				<!-- MOBILE ACTION SELECT DROPDOWN
            Visible only on small screens (hidden on lg) -->
				<div class="d-lg-none mb-3">
					<!-- Label for select input -->
					<label class="fw-bold mb-1 small grey-text text-darken-1">
						SELECT ACTION:
					</label>

					<!-- Dropdown that controls the active action -->
					<select
						class="form-select border-2"
						:value="activeAction"
						@change="(e) => (activeAction = e.target.value)">
						<!-- Generate dropdown options from actions array -->
						<option
							v-for="a in actions"
							:key="a.id"
							:value="a.id">
							{{ a.label }}
						</option>
					</select>
				</div>

				<!-- DESKTOP SIDEBAR CARD
            Hidden on small screens -->
				<div
					class="card border-0 shadow-sm rounded-3 overflow-hidden d-none d-lg-block">
					<!-- SIDEBAR HEADER -->
					<div class="card-header p-3 indigo darken-4 shadow-none">
						<h5 class="mb-0 fw-bold white-text">Management</h5>
					</div>

					<!-- ACTION LIST -->
					<div class="list-group list-group-flush border-0">
						<!-- Loop through actions to create sidebar buttons -->
						<!--		When		clicked,		set		the		active		action		-->
						<!--		Highlight		the		currently		active		action		-->
						<button
							v-for="action in actions"
							:key="action.id"
							@click="activeAction = action.id"
							class="list-group-item list-group-item-action d-flex align-items-center p-3 border-0"
							:class="{
								'grey lighten-4 shadow-inset': activeAction === action.id,
							}">
							<!-- Action icon -->
							<i
								:class="[
									action.icon,
									'me-3 fs-5 rounded p-2 white-text shadow-sm',
									action.color,
								]">
							</i>

							<!-- Action label -->
							<span
								:class="
									activeAction === action.id
										? 'indigo-text text-darken-4 fw-bold'
										: 'grey-text text-darken-3'
								">
								{{ action.label }}
							</span>
						</button>
					</div>
				</div>
			</aside>

			<!-- ======================================================
          MAIN CONTENT AREA
          ====================================================== -->

			<main
				class="col-12 col-lg-9"
				:class="{ 'red-text text-darken-2': activeAction === 'delete' }">
				<!--	If deletemode is active, change the text color -->
				<!-- MAIN CONTENT CARD -->
				<div class="card border-0 shadow-sm rounded-3 white">
					<!-- ======================================================
              TABS HEADER
              ====================================================== -->
					<div class="card-header white border-bottom p-0 shadow-none">
						<!-- Tab navigation -->
						<ul class="nav nav-tabs border-0 px-3 pt-2">
							<!-- Generate tabs dynamically -->
							<li
								v-for="tab in tabs"
								:key="tab.id"
								class="nav-item">
								<!-- Tab button --><!--
									Active
									tab
									styling
									-->
								<button
									@click="activeTab = tab.id"
									class="nav-link border-0 px-4 py-3 bg-transparent"
									:class="
										activeTab === tab.id
											? activeAction === 'delete'
												? 'red-text text-darken-2 border-bottom-red'
												: 'indigo-text text-darken-4 border-bottom-indigo'
											: 'grey-text'
									">
									{{ tab.label }}
								</button>
							</li>
						</ul>
					</div>

					<!-- ======================================================
              MAIN BODY CONTENT
              ====================================================== -->
					<div class="card-body p-4">
						<!-- ===============================================
                ADD NEW MODE
                =============================================== -->
						<div
							v-if="activeAction === 'add-new'"
							class="text-center py-5">
							<!-- Page title showing active tab -->
							<h4 class="fw-bold mb-4 grey-text text-darken-4">
								Select a preset for {{ getActiveTabName() }}
							</h4>

							<!-- Preset card options -->
							<div class="row justify-content-center g-3">
								<!-- STANDARD POST PRESET -->
								<div class="col-md-5">
									<div
										class="p-5 border border-2 rounded-3 hover-shadow cursor-pointer grey lighten-5">
										<i
											class="bi bi-collection-play fs-1 indigo-text text-darken-4"></i>
										<h5 class="mt-3 fw-bold grey-text text-darken-4">
											Standard Gallery/Post
										</h5>
									</div>
								</div>

								<!-- PRIORITY NOTICE PRESET -->
								<div class="col-md-5">
									<div
										class="p-5 border border-2 rounded-3 hover-shadow cursor-pointer grey lighten-5">
										<i
											class="bi bi-exclamation-triangle fs-1 red-text text-darken-2"></i>
										<h5 class="mt-3 fw-bold grey-text text-darken-4">
											Priority Notice
										</h5>
									</div>
								</div>
							</div>
						</div>

						<!-- ===============================================
                VIEW / UPDATE / DELETE TABLE MODE
                =============================================== -->
						<div v-else>
							<!-- HEADER ABOVE TABLE -->
							<div
								class="d-flex justify-content-between align-items-center mb-4">
								<!-- Current listing title -->
								<h5
									class="fw-bold m-0 uppercase"
									:class="
										activeAction === 'delete'
											? 'red-text'
											: 'indigo-text text-darken-4'
									">
									Listing {{ activeTab }}
								</h5>

								<!-- Badge showing current mode -->
								<span
									:class="[
										'badge rounded-pill p-2 px-3 white-text shadow-none',
										getActiveActionColor(),
									]">
									Mode: {{ activeAction }}
								</span>
							</div>

							<!-- TABLE -->
							<div class="table-responsive">
								<table class="table table-hover align-middle border">
									<!-- TABLE HEADERS -->
									<thead class="grey lighten-3">
										<tr
											:class="{
												'red-text text-darken-2': activeAction === 'delete',
											}">
											<th class="fw-bold">Title / Subject</th>
											<th class="fw-bold">Date</th>
											<th class="fw-bold">Status</th>
											<th class="text-end fw-bold">Control</th>
										</tr>
									</thead>

									<!-- TABLE BODY -->
									<tbody>
										<tr>
											<!-- Example row -->
											<td>Sample Item</td>
											<td>March 2026</td>

											<!-- Status indicator -->
											<td>
												<span
													class="badge green darken-2 white-text shadow-none">
													Active
												</span>
											</td>

											<!-- Action buttons depending on mode -->
											<td class="text-end">
												<!-- Delete mode -->
												<button
													v-if="activeAction === 'delete'"
													class="btn red darken-2 white-text z-depth-1">
													DELETE
												</button>

												<!-- Update mode -->
												<button
													v-else-if="activeAction === 'update'"
													class="btn blue darken-2 white-text shadow-none">
													EDIT
												</button>

												<!-- View mode -->
												<button
													v-else
													class="btn transparent shadow-none blue-text text-darken-2 fw-bold">
													VIEW
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue";

	/* ---------------------------------------------------------
  REACTIVE STATE
  These hold the currently selected UI states
  --------------------------------------------------------- */

	/*
activeAction
determines the current mode of the page
possible values:
- add-new
- update
- delete
- see-all
*/
	const activeAction = ref("see-all");

	/*
activeTab
determines which content category is selected
*/
	const activeTab = ref("news");

	/* ---------------------------------------------------------
  CONFIGURATION DATA
  These arrays power the sidebar and tab navigation
  --------------------------------------------------------- */

	/*
actions array
used to dynamically generate sidebar buttons
*/
	const actions = [
		{
			id: "add-new",
			label: "Add New",
			icon: "bi-plus-lg",
			color: "green darken-2",
		},
		{
			id: "update",
			label: "Update Content",
			icon: "bi-pencil-square",
			color: "blue darken-2",
		},
		{
			id: "delete",
			label: "Remove Item",
			icon: "bi-trash3",
			color: "red darken-2",
		},
		{
			id: "see-all",
			label: "View All Records",
			icon: "bi-grid-3x3-gap",
			color: "indigo darken-4",
		},
	];

	/*
tabs array
used to dynamically generate the content tabs
*/
	const tabs = [
		{ id: "news", label: "News & Notices" },
		{ id: "academics", label: "Academic Pillars" },
		{ id: "gallery", label: "Gallery Folders" },
	];

	/* ---------------------------------------------------------
  HELPER METHODS
  Used to generate dynamic labels and styling
  --------------------------------------------------------- */

	/*
getActiveTabName()

finds the full label name of the current tab
example:
"news" -> "News & Notices"
*/
	const getActiveTabName = () => {
		const tabObj = tabs.find(function (t) {
			return t.id === activeTab.value;
		});

		return tabObj ? tabObj.label : "";
	};

	/*
getActiveActionColor()

returns the color class associated
with the currently active action
*/
	const getActiveActionColor = () => {
		const actionObj = actions.find(function (a) {
			return a.id === activeAction.value;
		});

		return actionObj ? actionObj.color : "grey";
	};
</script>

<style scoped>
	/* ---------------------------------------------------------
  CUSTOM CSS
  UI tweaks for tabs, hover effects and styling
  --------------------------------------------------------- */

	/* active tab underline for normal mode */
	.border-bottom-indigo {
		border-bottom: 3px solid #1a237e !important;
	}

	/* active tab underline for delete mode */
	.border-bottom-red {
		border-bottom: 3px solid #d32f2f !important;
	}

	/* hover effect for preset cards */
	.hover-shadow:hover {
		transform: translateY(-4px);
		transition: all 0.2s;
		border-color: #1a237e !important;
	}

	/* pointer cursor for clickable cards */
	.cursor-pointer {
		cursor: pointer;
	}

	/* sidebar active action indicator */
	.shadow-inset {
		box-shadow: inset 4px 0 0 #1a237e;
	}

	/* uppercase text style */
	.uppercase {
		text-transform: uppercase;
		letter-spacing: 1px;
	}
</style>
