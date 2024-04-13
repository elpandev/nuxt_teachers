<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { EventFactory } from '~/src/modules/event/domain/factory';
import { event_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { event_type_options } from '~/src/modules/event/domain/model';

const props     = defineProps<{ event_id?: string }>()
const title     = `${ props.event_id ? 'Editar' : 'Nueva' } Categoría`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()

const store = useRequest(async () => {
  try {
    await event_request.store(data.value!.event!)

    snackbar.value.success(`La categoría "${data.value!.event!.name}" ha sido creada`)

    data.value!.event = new EventFactory().generate()
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
  const event = props.event_id
    ? await event_request.get(props.event_id)
    : new EventFactory().generate()

  return { event }
})

useSeoMeta({ title })
</script>

<template>
  <v-custom-header-primary :name="title" />

  <main v-if="!pending" class="create">
    <template v-if="data?.event">
      <form class="form" @submit.prevent="store.request()">
        <v-selector v-model="data.event.type" :label="'Tipo'" :options="event_type_options" />

        <v-input v-model="data.event.name"        :label="'Nombre'" />
        <v-input v-model="data.event.description" :label="'Descripción'" />

        <v-input v-model="data.event.date_at" :type="'datetime-local'" :label="'Fecha'" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
