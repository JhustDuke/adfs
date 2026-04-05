<template>
	<div class="card shadow p-4">
		<h4 class="mb-3">Create News</h4>

		<form @submit.prevent="handleSubmit">
			<!-- TITLE -->
			<div class="mb-3">
				<label class="form-label">Title</label>
				<input
					v-model="form.title"
					class="form-control" />
				<small
					class="text-danger"
					v-if="errors.title">
					{{ errors.title }}
				</small>
			</div>

			<!-- DATE -->
			<div class="mb-3">
				<label class="form-label">Date</label>
				<input
					type="date"
					v-model="form.date"
					class="form-control" />
				<small
					class="text-danger"
					v-if="errors.date">
					{{ errors.date }}
				</small>
			</div>

			<!-- EXCERPT -->
			<div class="mb-3">
				<label class="form-label">Excerpt</label>
				<textarea
					v-model="form.excerpt"
					class="form-control"></textarea>
				<small
					class="text-danger"
					v-if="errors.excerpt">
					{{ errors.excerpt }}
				</small>
			</div>

			<!-- FULL TEXT -->
			<div class="mb-3">
				<label class="form-label">Full Text</label>
				<textarea
					v-model="form.fullText"
					class="form-control"
					rows="6"></textarea>
				<small
					class="text-danger"
					v-if="errors.fullText">
					{{ errors.fullText }}
				</small>
			</div>

			<!-- CATEGORY -->
			<div class="mb-3">
				<label class="form-label">Category</label>

				<select
					v-model="form.category"
					class="form-select">
					<option
						value=""
						disabled
						>Select category</option
					>
					<option value="urgent">Urgent</option>
					<option value="announcement">Announcement</option>
					<option value="event">Event</option>
					<option value="academic">Academic</option>
					<option value="sports">Sports</option>
					<option value="holiday">Holiday</option>
					<option value="general">General</option>
				</select>

				<small
					class="text-danger"
					v-if="errors.category">
					{{ errors.category }}
				</small>
			</div>

			<!-- SUBMIT -->
			<button
				class="btn btn-primary"
				:disabled="loading">
				<span
					v-if="loading"
					class="spinner-border spinner-border-sm me-2"></span>
				{{ loading ? "Submitting..." : "Publish News" }}
			</button>

			<!-- ERROR -->
			<div
				v-if="error"
				class="text-danger mt-2">
				{{ error }}
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref } from "vue";

	const loading = ref(false);
	const error = ref("");

	/* CHANGED: removed UI styling fields (bgColor, badgeColor) */
	const form = reactive({
		title: "",
		date: "",
		excerpt: "",
		fullText: "",
		category: "",
	});

	const errors = reactive<
		Record<"title" | "date" | "excerpt" | "fullText" | "category", string>
	>({
		title: "",
		date: "",
		excerpt: "",
		fullText: "",
		category: "",
	});

	function sanitizeInput(value: string): string {
		return value
			.replace(/<script.*?>.*?<\/script>/gi, "")
			.replace(/<\/?[^>]+(>|$)/g, "")
			.replace(/javascript:/gi, "")
			.replace(/onerror|onload/gi, "")
			.trim();
	}

	/* CHANGED: injection pattern detection */
	function hasDangerousPatterns(value: string): boolean {
		const pattern =
			/(\b(SELECT|INSERT|DELETE|DROP|UPDATE|UNION|OR\s+1=1)\b|--|;|\/\*)/i;
		return pattern.test(value);
	}

	function validateForm(): boolean {
		let valid = true;

		errors.title = "";
		errors.date = "";
		errors.excerpt = "";
		errors.fullText = "";
		errors.category = "";

		const fields = [
			{ key: "title", value: form.title },
			{ key: "date", value: form.date },
			{ key: "excerpt", value: form.excerpt },
			{ key: "fullText", value: form.fullText },
			{ key: "category", value: form.category },
		];

		for (const field of fields) {
			const raw = String(field.value);
			const clean = raw.trim();

			// empty check
			if (!clean) {
				errors[field.key as keyof typeof errors] = "Required field";
				valid = false;
				continue;
			}

			// CHANGED: injection detection
			if (hasDangerousPatterns(clean)) {
				errors[field.key as keyof typeof errors] = "Invalid input detected";
				valid = false;
				continue;
			}

			if (clean !== sanitizeInput(clean)) {
				errors[field.key as keyof typeof errors] = "Unsafe input detected";
				valid = false;
				continue;
			}
		}

		return valid;
	}

	/* CHANGED: centralized sanitization */
	function buildPayload() {
		return {
			title: sanitizeInput(form.title),
			date: sanitizeInput(form.date),
			excerpt: sanitizeInput(form.excerpt),
			fullText: sanitizeInput(form.fullText),
			category: sanitizeInput(form.category),
		};
	}

	/* CHANGED: reset isolation */
	function resetForm() {
		form.title = "";
		form.date = "";
		form.excerpt = "";
		form.fullText = "";
		form.category = "";
	}

	async function handleSubmit() {
		error.value = "";

		if (!validateForm()) return;

		loading.value = true;

		const payload = buildPayload();

		try {
			/* CHANGED: real API call instead of simulation */
			const res = await fetch("/api/news/createNews", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			/* CHANGED: handle backend error */
			if (!res.ok) {
				error.value = data?.error || "Failed to create news";
				console.log("error before returning");
				return;
			}

			console.log("News created:", data);

			/* CHANGED: reset only on success */
			resetForm();
		} catch (err: any) {
			console.log("network error before returning");
			error.value = err?.message || "Network error";
		} finally {
			loading.value = false;
		}
	}
</script>
