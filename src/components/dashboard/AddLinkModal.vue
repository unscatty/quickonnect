<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useMutation as useGQLMutation } from '@vue/apollo-composable'
import { graphql, useFragment } from '~/graphql/generated'
import { LINK_INFO_FRAGMENT } from '~/graphql/links/info.fragment'

const queryClient = useQueryClient()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:isOpen'])

const isOpen = useVModel(props, 'isOpen', emit)

const defaultLinkForm = {
  name: '',
  url: '',
  type: 'i-heroicons:link',
}
// Bind form to ref value
const insertLinkForm = ref(structuredClone(defaultLinkForm))

// Add link mutation
const { mutate: createNewLink } = useGQLMutation(
  graphql(`
    mutation AddLink($linkData: links_insert_input!) {
      newLink: insert_links_one(object: $linkData) {
        ...LinkInfo
      }
    }
  `)
)

const { mutate } = useMutation({
  mutationFn: async (...createParams: Parameters<typeof createNewLink>) => {
    const createdLink = await createNewLink(...createParams)

    return useFragment(LINK_INFO_FRAGMENT, createdLink?.data?.newLink)
  },
  // Optimistically insert new value
  onMutate: async (newLink) => {
    await queryClient.cancelQueries({ queryKey: ['links'] })

    const previousLinks = queryClient.getQueryData(['links'])

    queryClient.setQueryData(['links'], (old: any) => {
      return [...old, newLink?.linkData]
    })

    return { previousLinks }
  },
  // If the mutation fails,
  // use the context returned from onMutate to roll back
  onError: (err, newLink, context) => {
    queryClient.setQueryData(['links'], context?.previousLinks)
  },
})

const addNewLink = async () => {
  mutate({ linkData: insertLinkForm.value })

  insertLinkForm.value = structuredClone(defaultLinkForm)

  isOpen.value = false
}
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      :open="isOpen"
      :unmount="false"
      @close="isOpen = false"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all"
            sm="my-8 align-middle max-w-xl w-full p-6"
          >
            <!-- Content goes here -->
            <div class="space-y-6 sm:space-y-5">
              <div>
                <DialogTitle
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  Add new link
                </DialogTitle>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Description</p>
              </div>
              <form class="space-y-6 sm:space-y-5" @submit.prevent="addNewLink">
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Name
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      id="name"
                      v-model="insertLinkForm.name"
                      type="text"
                      name="name"
                      autocomplete="name"
                      class="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md text-gray-800"
                    />
                  </div>
                </div>

                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="url"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    URL
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      id="url"
                      v-model="insertLinkForm.url"
                      type="text"
                      name="url"
                      autocomplete="url"
                      class="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md text-gray-800"
                    />
                  </div>
                </div>
                <div
                  class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
                >
                  <label
                    for="icon"
                    class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Icon
                  </label>
                  <div class="mt-1 sm:mt-0 sm:col-span-2">
                    <IconDropdown v-model:selected-icon="insertLinkForm.type" />
                  </div>
                </div>
                <div class="flex justify-end gap-4">
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    @click="isOpen = false"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600"
                    hover="bg-indigo-700"
                    focus="outline-none ring-2 ring-offset-2 ring-indigo-500"
                  >
                    <span> Guardar </span>
                  </button>
                </div>
              </form>
            </div>
            <!-- Content ends here -->
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
