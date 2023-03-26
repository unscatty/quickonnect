<script setup lang="ts">
import {
  useProviderLink,
  useSignInEmailPassword,
  useSignUpEmailPassword,
} from '@nhost/vue'
const { t, locale } = useI18n()
const { google, github } = useProviderLink()

const props = defineProps({
  isSignIn: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits(['update:isSignIn'])

/**
 * Change whether user wants to sign up or sign in
 */
const isSignIn = useVModel(props, 'isSignIn', emit)

const actionMessage = computed<Parameters<typeof t>[0]>(() =>
  isSignIn.value ? 'auth.sign-in-message' : 'auth.sign-up-message'
)
const oppositeActionMessage = computed(() =>
  isSignIn.value ? 'auth.sign-up-message' : 'auth.sign-in-message'
)

const signUpEmailPassword = useSignUpEmailPassword({ locale })
const signInEmailPassword = useSignInEmailPassword()
const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

const displayName = computed(() => firstName.value + ' ' + lastName.value)

const handleSignUp = async () => {
  const signUpResult = await signUpEmailPassword.signUpEmailPassword(
    email,
    password,
    {
      metadata: { firstName, lastName },
      displayName,
      locale,
    }
  )

  if (signUpResult.isSuccess) router.push('/')
}

const handleSignIn = async () => {
  const signInResult = await signInEmailPassword.signInEmailPassword(
    email,
    password
  )

  if (signInResult.isSuccess) router.push('/')
}

const handleSubmit = computed(() =>
  isSignIn.value ? handleSignIn : handleSignUp
)
</script>

<template>
  <div class="mx-auto w-full max-w-sm lg:w-96">
    <div>
      <img
        class="h-12 w-auto"
        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
        alt="Workflow"
      />
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
        {{ t('auth.title', { action: t(actionMessage) }) }}
      </h2>
      <p
        class="flex justify-between sm:justify-inherit mt-2 text-sm text-gray-600"
      >
        <span class="sm:mr-2">{{
          t(
            isSignIn
              ? 'auth.do-not-have-an-account'
              : 'auth.already-have-an-account'
          )
        }}</span>
        <!-- Signup/Signin instead -->
        <a
          href="#"
          class="font-medium text-indigo-600 hover:text-indigo-500"
          @click="isSignIn = !isSignIn"
        >
          {{ t('auth.action-instead', { action: t(oppositeActionMessage) }) }}
        </a>
      </p>
    </div>

    <div class="mt-8">
      <div>
        <div>
          <p class="text-sm font-medium text-gray-700">
            {{ t('auth.action-with', { action: t(actionMessage) }) }}
          </p>

          <div class="mt-1 grid grid-cols-3 gap-3">
            <div>
              <a
                :href="google"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with Google</span>
                <!-- width="256"
                height="262" -->
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  />
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  />
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  />
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  />
                </svg>
              </a>
            </div>

            <div>
              <a
                :href="github"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with GitHub</span>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="mt-6 relative">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">{{
              t('auth.or-continue-with')
            }}</span>
          </div>
        </div>
      </div>

      <p v-show="signUpEmailPassword.needsEmailVerification">
        Please check your mailbox and follow the verification link to verify
        your email.
      </p>

      <p v-if="signUpEmailPassword.isError" class="text-red-400">
        {{ signUpEmailPassword.error.value?.message }}
      </p>
      <p v-if="signInEmailPassword.isError" class="text-red-400">
        {{ signInEmailPassword.error.value?.message }}
      </p>

      <div class="mt-6">
        <form action="#" method="POST" class="space-y-6">
          <!-- Full name -->
          <div
            v-show="!isSignIn"
            class="flex gap-x-4 gap-y-6 flex-col"
            sm="flex-row"
          >
            <div>
              <label
                for="firstname"
                class="block text-sm font-medium text-gray-700"
              >
                {{ t('auth.form.first-name') }}
              </label>
              <div class="mt-1">
                <input
                  id="firstname"
                  v-model="firstName"
                  required
                  name="firstname"
                  type="text"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                for="lastname"
                class="block text-sm font-medium text-gray-700"
              >
                {{ t('auth.form.last-name') }}
              </label>
              <div class="mt-1">
                <input
                  id="lastname"
                  v-model="lastName"
                  required
                  name="lastname"
                  type="text"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              {{ t('auth.form.email') }}
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                required
                name="email"
                type="email"
                autocomplete="email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              {{ t('auth.form.password') }}
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                required
                name="password"
                type="password"
                autocomplete="current-password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                {{ t('auth.form.remember-me') }}
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {{ t('auth.form.forgot-password') }}
              </a>
            </div>
          </div>

          <div>
            <button
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click.prevent="handleSubmit"
            >
              {{ t(actionMessage) }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
