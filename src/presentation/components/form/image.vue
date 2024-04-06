<script setup lang="ts">
  import { Uploader } from '#imports';
  import { FileValue } from '@/elpandev/hexagonal';
  import { url } from '~/src/modules/storage/aplication/url';
  import { FirebaseeStorageRepository } from '~/src/modules/storage/infrastructure/firebase_storage_repository';

  interface Props {
    image: FileValue
    uploader: Uploader
    label?: string
    deleteable: boolean
    errors?: string[]
  }

  const props              = withDefaults(defineProps<Props>(), { deleteable: true })
  const storage_repository = new FirebaseeStorageRepository()

  function on_change(event: any) {
    if (event.target.files[0] == undefined) return

    props.image.file = event.target.files[0]
    props.image.name = props.image.file!.name.split('.')[0]
  }

  const href = computed(() => {
    if (props.image.file != null)      return URL.createObjectURL(props.image.file)
    if (props.image.path.isNotEmpty()) return url(storage_repository, props.image.path)

    return null
  })
</script>

<template>
  <div class="field image" v-if="!props.image.destroyed">
    <label v-if="label">{{ label }}</label>
    <label :for="props.image.id" class="input">
      <div>
        <a v-if="href" :href="href" target="_blank" rel="noopener noreferrer">{{ label ? '' : 'Imagen:' }} {{ props.image.name }}</a>
        <span v-else>Imagen</span>
      </div>
      <button v-if="props.deleteable" type="button" @click="props.uploader.remove(image)"><v-icon-close /></button>
    </label>
    <input :id="props.image.id" accept="image/jpg" type='file' @change="on_change" hidden />
    <v-errors :errors="props.errors" />
  </div>
</template>
