<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const iconOptions = [
  // Formal ?
  { class: 'i-simple-icons:linkedin', description: 'LinkedIn' },
  { class: 'i-simple-icons:github', description: 'Github' },
  { class: 'i-simple-icons:behance', description: 'Behance' },
  { class: 'i-carbon:portfolio', description: 'Portfolio' },
  { class: 'i-heroicons:globe-alt', description: 'Website' },

  // Social
  { class: 'i-simple-icons:facebook', description: 'Facebook' },
  { class: 'i-simple-icons:instagram', description: 'Instagram' },
  { class: 'i-simple-icons:discord', description: 'Discord' },
  { class: 'i-simple-icons:telegram', description: 'Telegram' },
  { class: 'i-heroicons:link', description: 'Otro' },
]

const props = defineProps<{
  selectedIcon: string
}>()

const emit = defineEmits(['update:selectedIcon'])

const selectedIcon = useVModel(props, 'selectedIcon', emit)

const selectIcon = (index: number) => {
  selectedIcon.value = iconOptions[index].class
}
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton>
        <slot>
          <div
            class="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-3 py-3 bg-white text-sm font-medium text-gray-700"
            hover="bg-gray-50"
            focus="outline-none ring-2 ring-offset-2 ring-offset-gray-100 ring-indigo-500"
          >
            <div :class="selectedIcon" class="h-8 w-8" />
          </div>
        </slot>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="origin-top-left absolute left-0 bottom-11 mt-2 w-66.5 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-30 container grid grid-cols-4 gap-2 mx-auto p-2"
        sm="w-86.5 grid-cols-5"
        focus="outline-none"
      >
        <MenuItem v-for="(iconOption, index) in iconOptions" :key="index" v-slot="{ active }">
          <a
            href="#"
            :class="[
              active ? 'bg-gray-1 text-black rounded-xl' : 'text-gray-400',
              'px-4 py-2 text-sm',
            ]"
            data-te-toggle="tooltip"
            :title="iconOption.description"
            @click="selectIcon(index)"
          >
            <div :class="iconOption.class" class="w-full h-10" />
          </a>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
