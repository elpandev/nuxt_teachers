<script setup lang="ts">
  import { nano_id } from '@/elpandev/utils/methods/nano_id';
  import { RegisterRequestRepository } from '~/src/modules/register/aplication/request_repository';
  import { RegisterFilter } from '~/src/modules/register/domain/filter';
  import { Room, room_status_locale } from '~/src/modules/room/domain/model';
  import { useAuthState } from '~/src/presentation/states/auth';

  interface IProps {
    room: Room
  }

  const props = defineProps<IProps>()
  const auth  = useAuthState()

  const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
    const register_request = new RegisterRequestRepository()
    const filter           = new RegisterFilter({ room_id: props.room.id, next_reservation: { start_at: props.room.prev_register?.start_at ?? null }, limit: 1 })
    const registers        = await register_request.all(filter)

    return { next_register: registers[0] ?? null }
  })
</script>

<template>
  <article class="tile room" :class="{ [props.room.generate_status().url()]: true }">
    <span class="status">{{ room_status_locale(props.room.generate_status()) }}</span>
    <header>
      <div class="leading">
        <v-icon-room            v-if = "props.room.is_enabled" />
        <v-icon-disabled        v-if = "props.room.is_disabled" />
        <v-icon-person          v-if = "props.room.is_occuped" />
        <v-icon-assignment      v-if = "props.room.is_checkout" />
        <v-icon-assignment-late v-if = "props.room.is_late_checkout" />
      </div>
      <div class="content">
        <h3>{{ props.room.name }}</h3>
        <p>{{ props.room.description }}</p>
      </div>
      <div class="actions">
        <v-popup-menu>
          <template #content>
            <template v-if="props.room.register">
              <nuxt-link :to="`/tenants/${auth.tenant.id}/registers/${props.room.register?.id}`">
                <v-icon-assignment />
                Registro Actual
              </nuxt-link>
            </template>
            <nuxt-link :to="`/tenants/${auth.tenant.id}/registers?room_id=${props.room.id}`">
              <v-icon-list />
              Registros
            </nuxt-link>
            <nuxt-link :to="`/tenants/${auth.tenant.id}/registers/create?room_id=${props.room.id}`">
              <v-icon-add />
              Crear Registro
            </nuxt-link>
            <nuxt-link :to="`rooms/${props.room.id}/edit`">
              <v-icon-edit />
              Editar
            </nuxt-link>
            <button>
              <v-icon-close />
              Eliminar
            </button>
          </template>
        </v-popup-menu>
      </div>
    </header>
    <footer v-if="props.room.is_occuped || data?.next_register || props.room.requirements.isNotEmpty()">
      <ul>
        <li v-if="props.room.is_occuped"><b>Personas:</b><span>2</span></li>
        <li v-if="props.room.register"><b>Salida:</b><span>{{ new Date(props.room.register.end_at).toLocaleString() }}</span></li>
        <li v-if="data?.next_register" style="margin-top: 4px;"><b>Próxima reservación:</b><span>{{ new Date(data.next_register.start_at).toLocaleString() }}</span></li>
        <li v-if="props.room.requirements.isNotEmpty()">
          <b>Requerimentos:</b>
          <template v-for="requirement in props.room.requirements" :key="requirement.id">
            <NuxtLink class="requirement" :to="`requirements/${requirement.id}`" :class="{ problem: requirement.problem != null }" :ttt="requirement.problem?.description ?? requirement.description">
              {{ requirement.name }}
            </NuxtLink>
          </template>
        </li>
      </ul>
    </footer>
  </article>
</template>

<style lang="scss">
@mixin status($status, $color) {
  &.#{$status} {
    border: 1px solid rgba($color, 0.32);
    > .status {
      color: $color;
    }
    > header {
      .leading {
        svg {
          fill: $color;
        }
      }
      .content {
        .title {
          .label {
            background-color: rgba($color, 0.05);
            border-color: $color;
            color: $color;
          }
        }
      }
    }
  }
}

article.tile.room {
  > footer {
    .requirement {
      color: $color_primary;
      text-decoration: underline;
    }
  }

  @include status(enabled, $color_green);
  @include status(disabled, grey);
  @include status(occuped, $color_primary);
  @include status(checkout, $color_orange);
  @include status(late-checkout, $color_red);
}
</style>