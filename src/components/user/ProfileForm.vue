<script setup lang="ts">
import { useNhostClient, useUserData } from '@nhost/vue'
// import { useMutation } from '@vue/apollo-composable'
import { useMutation } from '@tanstack/vue-query'
import { USER_UPDATE_METADATA_MUTATION } from '~/graphql/user/update-metadata.mutation'
import { VariablesOf } from '@graphql-typed-document-node/core'
import gqlClient from '~/services/graphql-client'

const { nhost } = useNhostClient()

const userData = useUserData()
const userMetadata = userData.value?.metadata

const displayName = ref(userData.value?.displayName ?? '')
const firstName = ref(<string>userMetadata?.firstName ?? '')
const lastName = ref(<string>userMetadata?.lastName ?? '')
const about = ref(<string>userMetadata?.about ?? '')

// const { mutate, loading } = useMutation(USER_UPDATE_METADATA_MUTATION)

const { mutate: mutUpdateUserProfile, isLoading } = useMutation({
  mutationFn: async (
    updateUserProfileParams: VariablesOf<typeof USER_UPDATE_METADATA_MUTATION>
  ) =>
    gqlClient.request(USER_UPDATE_METADATA_MUTATION, updateUserProfileParams),
})

const updateUserProfile = async (event: Event) => {
  event.preventDefault()

  mutUpdateUserProfile({
    id: userData.value?.id,
    displayName: displayName.value,
    metadata: {
      firstName: firstName.value,
      lastName: lastName.value,
      about: about.value,
    },
  })

  await nhost.auth.refreshSession()
}
</script>

<template>
  <form class="space-y-8 divide-y divide-gray-200" @submit="updateUserProfile">
    <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
      <div>
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Profile</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>

        <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
          <div
            class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
          >
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Display name
            </label>
            <div class="mt-1 sm:mt-0 sm:col-span-2">
              <div class="max-w-lg flex rounded-md shadow-sm">
                <input
                  id="username"
                  v-model="displayName"
                  type="text"
                  name="username"
                  autocomplete="username"
                  class="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
          </div>

          <div
            class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
          >
            <label
              for="about"
              class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              About
            </label>
            <div class="mt-1 sm:mt-0 sm:col-span-2">
              <textarea
                id="about"
                v-model="about"
                name="about"
                rows="3"
                class="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              />
              <p class="mt-2 text-sm text-gray-500">
                Write a few sentences about yourself.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Personal Information
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Use a permanent address where you can receive mail.
          </p>
        </div>
        <div class="space-y-6 sm:space-y-5">
          <div
            class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
          >
            <label
              for="first-name"
              class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              First name
            </label>
            <div class="mt-1 sm:mt-0 sm:col-span-2">
              <input
                id="first-name"
                v-model="firstName"
                type="text"
                name="first-name"
                autocomplete="given-name"
                class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div
            class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
          >
            <label
              for="last-name"
              class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Last name
            </label>
            <div class="mt-1 sm:mt-0 sm:col-span-2">
              <input
                id="last-name"
                v-model="lastName"
                type="text"
                name="last-name"
                autocomplete="family-name"
                class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-5">
      <div class="flex justify-end">
        <button
          type="button"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="min-w-20 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div
            v-if="isLoading"
            class="inline-block h-5 w-5 animate-spin rounded-full border-3 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
          <div v-else>Save</div>
        </button>
      </div>
    </div>
  </form>
</template>
