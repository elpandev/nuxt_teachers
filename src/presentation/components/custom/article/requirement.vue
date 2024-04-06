<script setup lang="ts">
  import { Requirement } from '~/src/modules/requirement/domain/model';
  import { useAuthState } from '~/src/presentation/states/auth';

  interface IProps {
    requirement: Requirement
  }

  const props = defineProps<IProps>()
  const auth  = useAuthState()
</script>

<template>
  <article class="tile requirement">
    <span class="status">
      <template v-if="props.requirement.room">
        {{ props.requirement.room.name }}
      </template>
      <template v-if="props.requirement.role">
        - {{ props.requirement.role.name }}
      </template>
      - {{ props.requirement.status }}
    </span>
    <header>
      <div class="leading">
        <v-icon-task />
      </div>
      <div class="content">
        <h3>{{ props.requirement.name }}</h3>
        <p v-if="props.requirement.description.isNotEmpty()">{{ props.requirement.description }}</p>
      </div>
      <v-popup-menu>
        <template #content>
          <nuxt-link :to="`requirements/${props.requirement.id}`">
            <v-icon-visibility />
            Ver
          </nuxt-link>
          <nuxt-link :to="`requirements/${props.requirement.id}/edit`">
            <v-icon-edit />
            Editar
          </nuxt-link>
          <button>
            <v-icon-close />
            Eliminar
          </button>
        </template>
      </v-popup-menu>
    </header>
    <footer v-if="props.requirement.comment.isNotEmpty() || props.requirement.problem?.description.isNotEmpty() || props.requirement.solution?.comment.isNotEmpty()">
      <p v-if="props.requirement.comment.isNotEmpty()"><b>Comentario:</b> {{ props.requirement.comment }}</p>
      <p v-if="props.requirement.problem?.description.isNotEmpty()"><b>Problema:</b> {{ props.requirement.problem?.description }}</p>
      <p v-if="props.requirement.solution?.comment.isNotEmpty()"><b>Solución:</b> {{ props.requirement.solution?.comment }}</p>
    </footer>
  </article>
</template>

<style lang="scss">
@mixin status($status, $color) {
  &.#{$status} {
    .leading {
      svg {
        fill: $color;
      }
    }
    .content {
      header {
        .label {
          background-color: rgba($color, 0.05);
          border-color: $color;
          color: $color;
        }
      }
    }
  }
}

article.tile.room {
  @include status(enabled, grey);
  @include status(disabled, grey);
  @include status(occuped, $color_green);
  @include status(checkout, $color_orange);
  @include status(late-checkout, $color_red);
}
</style>