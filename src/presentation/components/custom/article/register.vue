<script setup lang="ts">
  import { Register } from '~/src/modules/register/domain/model';
  import { useAuthState } from '~/src/presentation/states/auth';

  interface IProps {
    register: Register
  }

  const props = defineProps<IProps>()
  const auth  = useAuthState()
</script>

<template>
  <article class="tile register">
    <span class="status">
      <template v-if="props.register.room">
        {{ props.register.room.name }}
      </template>
      - {{ props.register.status }}
    </span>
    <header>
      <div class="leading">
        <v-icon-assignment />
      </div>
      <div class="content">
        <h3>{{ props.register.client.name }}</h3>
        <p>{{ new Date(props.register.start_at).toLocaleString() }} - {{ new Date(props.register.end_at).toLocaleString() }}</p>
      </div>
      <v-popup-menu>
        <template #content>
          <nuxt-link :to="`registers/${props.register.id}`">
            <v-icon-visibility />
            Ver
          </nuxt-link>
          <nuxt-link :to="`registers/${props.register.id}/edit`">
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
    <footer>
      <ul>
        <li v-if="props.register.clients_count > 0">
          <b>Personas:</b>
          <span>{{ props.register.clients_count }}</span>
        </li>
      </ul>
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