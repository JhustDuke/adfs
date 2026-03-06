<template>
	<!-- ======================================================
      PAGE WRAPPER
      Centers the login card vertically and horizontally
      ====================================================== -->
	<div
		class="d-flex align-items-center justify-content-center"
		style="min-height: 70vh">
		<!-- ======================================================
        LOGIN CARD CONTAINER
        Holds the entire login UI
        ====================================================== -->
		<div
			class="card border-0 shadow-lg rounded-4 overflow-hidden"
			style="max-width: 400px; width: 100%">
			<!-- ======================================================
          CARD HEADER
          Displays portal title and icon
          ====================================================== -->
			<div class="card-header indigo darken-4 py-4 text-center border-0">
				<!-- Staff icon -->
				<i class="bi bi-person-badge white-text display-5"></i>

				<!-- Login title -->
				<h4 class="white-text fw-bold mt-2 mb-0 text-uppercase">
					Staff Login
				</h4>
			</div>

			<!-- ======================================================
          CARD BODY (LOGIN FORM)
          ====================================================== -->
			<div class="card-body p-4 p-md-5 white">
				<!-- Login form -->
				<!-- submit.prevent stops page refresh -->
				<form @submit.prevent="handleLogin">
					<!-- ==================================================
              PHONE NUMBER INPUT FIELD
              ================================================== -->
					<div class="mb-4">
						<!-- Field label -->
						<label class="form-label small fw-bold indigo-text text-darken-4">
							PHONE NUMBER
						</label>

						<!-- Input group with icon -->
						<!-- border-primary appears when user starts typing -->
						<div
							class="input-group border-bottom border-2 transition-focus"
							:class="{ 'border-primary': phone }">
							<!-- Phone icon -->
							<span class="input-group-text bg-transparent border-0 px-0 me-2">
								<i class="bi bi-phone grey-text"></i>
							</span>

							<!-- Phone input -->
							<input
								v-model="phone"
								type="tel"
								class="form-control border-0 shadow-none ps-0"
								placeholder="080XXXXXXXX"
								required />
						</div>
					</div>

					<!-- ==================================================
              PASSWORD INPUT FIELD
              ================================================== -->
					<div class="mb-4">
						<!-- Field label -->
						<label class="form-label small fw-bold indigo-text text-darken-4">
							PASSWORD
						</label>

						<!-- Input group container -->
						<!-- border-primary appears when user types -->
						<div
							class="input-group border-bottom border-2 transition-focus"
							:class="{ 'border-primary': password }">
							<!-- Lock icon -->
							<span class="input-group-text bg-transparent border-0 px-0 me-2">
								<i class="bi bi-lock grey-text"></i>
							</span>

							<!-- Password input -->
							<input
								v-model="password"
								type="password"
								class="form-control border-0 shadow-none ps-0"
								placeholder="••••••••"
								required />
						</div>
					</div>

					<!-- ==================================================
              ERROR MESSAGE ALERT
              Displayed when login fails
              ================================================== -->
					<div
						v-if="errorMessage"
						class="alert alert-danger py-2 small text-center border-0 mb-4 animate__animated animate__shakeX">
						<!-- Warning icon -->
						<i class="bi bi-exclamation-circle me-2"></i>

						<!-- Error text -->
						{{ errorMessage }}
					</div>

					<!-- ==================================================
              LOGIN BUTTON
              Shows spinner when loading
              ================================================== -->
					<div class="d-grid shadow-sm">
						<button
							type="submit"
							class="btn btn-lg indigo darken-4 white-text z-depth-1 rounded-pill fw-bold d-flex align-items-center justify-content-center"
							:disabled="isLoading">
							<!-- Loading spinner -->
							<span
								v-if="isLoading"
								class="spinner-border spinner-border-sm me-2"></span>

							<!-- Dynamic button text -->
							{{ isLoading ? "VERIFYING..." : "LOGIN TO DASHBOARD" }}
						</button>
					</div>
				</form>
			</div>

			<!-- ======================================================
          CARD FOOTER
          Displays system version
          ====================================================== -->
			<div class="card-footer bg-light py-3 text-center border-0">
				<span class="small text-muted"> Secured Portal v2.0 </span>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue";

	/* =========================================================
  REACTIVE STATE VARIABLES
  These store the form data and UI states
  ========================================================= */

	/*
phone
Stores the phone number entered by the user
*/
	const phone = ref("");

	/*
password
Stores the password entered by the user
*/
	const password = ref("");

	/*
isLoading
Controls the login button spinner and disables the button
during authentication
*/
	const isLoading = ref(false);

	/*
errorMessage
Stores and displays login error messages
*/
	const errorMessage = ref("");

	/* =========================================================
  LOGIN HANDLER FUNCTION
  Called when the login form is submitted
  ========================================================= */
	const handleLogin = async () => {
		/* -----------------------------------------------------
      STEP 1
      Reset previous error messages
      ----------------------------------------------------- */
		errorMessage.value = "";

		/* -----------------------------------------------------
      STEP 2
      Basic client-side validation
      Ensures phone number is valid length
      ----------------------------------------------------- */
		if (phone.value.length < 10) {
			errorMessage.value = "Please enter a valid phone number.";

			return;
		}

		/* -----------------------------------------------------
      STEP 3
      Enable loading state
      ----------------------------------------------------- */
		isLoading.value = true;

		try {
			/* -------------------------------------------------
          PLACEHOLDER API CALL
          Replace with real backend authentication later
          ------------------------------------------------- */

			console.log("Attempting login for:", phone.value);

			/*
       Simulated network delay
       This mimics an API request
       */
			await new Promise(function (resolve) {
				setTimeout(resolve, 2000);
			});

			/* -------------------------------------------------
          STEP 4
          Login success logic
          Redirect user to admin dashboard
          ------------------------------------------------- */
			window.location.href = "/admin";
		} catch (err) {
			/* -------------------------------------------------
          STEP 5
          Error handling
          This would handle:
          - wrong password
          - network error
          - server error
          ------------------------------------------------- */
			errorMessage.value = "Invalid credentials. Please try again.";
		} finally {
			/* -------------------------------------------------
          STEP 6
          Disable loading spinner regardless of result
          ------------------------------------------------- */
			isLoading.value = false;
		}
	};
</script>

<style scoped>
	/* =========================================================
  CUSTOM STYLING
  UI tweaks and animations
  ========================================================= */

	/* ---------------------------------------------------------
  Uppercase heading style
  --------------------------------------------------------- */

	/* ---------------------------------------------------------
  Input focus transition
  Smoothly animates border color when input is focused
  --------------------------------------------------------- */
	.transition-focus {
		transition: border-color 0.3s ease;
	}

	/* Active input focus state */
	.transition-focus:focus-within {
		border-color: #1a237e !important; /* indigo darken-4 */
	}

	/* ---------------------------------------------------------
  Materialize-style elevation shadow
  --------------------------------------------------------- */
	.z-depth-1 {
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16),
			0 2px 10px 0 rgba(0, 0, 0, 0.12);
	}

	/* ---------------------------------------------------------
  Error message shake animation
  Used when login fails
  --------------------------------------------------------- */
	.animate__shakeX {
		animation: shakeX 0.5s;
	}

	/* ---------------------------------------------------------
  Keyframes for shake animation
  --------------------------------------------------------- */
	@keyframes shakeX {
		from,
		to {
			transform: translate3d(0, 0, 0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translate3d(-5px, 0, 0);
		}

		20%,
		40%,
		60%,
		80% {
			transform: translate3d(5px, 0, 0);
		}
	}
</style>
