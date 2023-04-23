<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useFragment } from '~/graphql/generated'
import { ALL_LINKS_QUERY } from '~/graphql/links/all.query'
import { LINK_INFO_FRAGMENT } from '~/graphql/links/info.fragment'
import gqlClient from '~/services/graphql-client'

const { data: links } = useQuery({
  queryKey: ['links'],
  queryFn: async () => {
    return useFragment(
      LINK_INFO_FRAGMENT,
      (await gqlClient.request(ALL_LINKS_QUERY))?.links
    )
  },
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
