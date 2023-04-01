<script setup lang="ts">
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { ALL_LINKS_QUERY } from '~/graphql/links/all.query'
import { LinkInfoFragment } from '~/graphql/links/info.fragment'
import { ON_NEW_LINK_SUBSCRIPTION } from '~/graphql/links/on-new.sub'
import { useFragment } from '../../graphql/generated'

const linksArray = ref(useFragment(LinkInfoFragment, []))

const links = computed({
  get() {
    return linksArray.value
  },
  set(newLinks) {
    linksArray.value = newLinks
  },
})

const { onResult: onAllLinks } = useQuery(ALL_LINKS_QUERY)

// Replace the links array with the new data
onAllLinks((result) => {
  if (result.data?.links?.length) {
    links.value = useFragment(LinkInfoFragment, result.data.links)
  }
})

const { onResult: onNewLinks } = useSubscription(ON_NEW_LINK_SUBSCRIPTION)

// Update the links array with the new data
onNewLinks((result) => {
  if (result.data?.newLinks?.length) {
    console.log('newLinks', result.data.newLinks)
    links.value = useFragment(LinkInfoFragment, result.data.newLinks)
  }
})
</script>

<template>
  <ul role="list" class="grid grid-cols-2 gap-4 m-6" sm="grid-cols-3 gap-2 m-2">
    <li
      v-for="link in links"
      :key="link.id"
      class="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
    >
      <a :href="link.url" target="_blank">
        <div class="flex-1 flex flex-col p-2">
          <div
            :class="link.type"
            class="w-20 h-20 mx-auto text-gray-900"
            sm="w-12 h-12"
          />
          <h3 class="mt-3 text-gray-900 text-sm font-medium">
            {{ link.name }}
          </h3>
        </div>
      </a>
    </li>
  </ul>
</template>
