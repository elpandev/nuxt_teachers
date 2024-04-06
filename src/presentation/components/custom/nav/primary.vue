<script setup lang="ts">
import { auth_request } from '~/src/config/repositories';
import { useShared } from '~/src/presentation/states/shared';

const shared = useShared()
</script>

<template>
  <nav class="primary" :class="{ enabled: shared.nav.enabled }">
    <header>
      <img src="/images/icon.png" alt="">
      <span>Scholar</span>
    </header>
    <section>
      <header>
        <h3>Menu</h3>
      </header>
      <ul class="links">
        <li>
          <nuxt-link class="link"   :to="`/students1`"><v-icon-person-outline /><span>Perfil</span></nuxt-link>
        </li>
        <li>
          <button class="link" @click="auth_request.logout()"><v-icon-close /><span>Salir</span></button>
        </li>
      </ul>
    </section>
    <section>
      <header>
        <h3>Escuela</h3>
      </header>
      <ul class="links">
        <li>
          <nuxt-link class="link"   :to="`/students`"><v-icon-person-outline /><span>Estudiantes</span></nuxt-link>
          <nuxt-link class="button" :to="`/students/create`"><v-icon-add /></nuxt-link>
        </li>
        <li>
          <nuxt-link class="link"   :to="`/courses`"><v-icon-school-outline /><span>Aulas</span></nuxt-link>
          <nuxt-link class="button" :to="`/courses/create`"><v-icon-add /></nuxt-link>
        </li>
        <li>
          <nuxt-link class="link"   :to="`/attendances`"><v-icon-calendar-check /><span>Assistencias</span></nuxt-link>
          <nuxt-link class="button" :to="`/attendances/create`"><v-icon-add /></nuxt-link>
        </li>
        <li>
          <nuxt-link class="link"   :to="`/grades`"><v-icon-bar-chart-square /><span>Calificaciones</span></nuxt-link>
          <nuxt-link class="button" :to="`/grades/create`"><v-icon-add /></nuxt-link>
        </li>
        <li>
          <nuxt-link class="link"   :to="`/tasks`"><v-icon-assignment/><span>Exámenes</span></nuxt-link>
          <nuxt-link class="button" :to="`/tasks/create`"><v-icon-add /></nuxt-link>
        </li>
        <li>
          <nuxt-link class="link"   :to="`/categories`"><v-icon-category-outline /><span>Categorías</span></nuxt-link>
          <nuxt-link class="button" :to="`/categories/create`"><v-icon-add /></nuxt-link>
        </li>
      </ul>
    </section>
    <footer>
      <span>Mejora a Premium</span>
      <span>Desbloquea todos los modulos con premium</span>
      <button>Obtener Premium</button>
      <button><v-icon-bookmark /></button>
    </footer>
  </nav>
</template>

<style lang="scss">
nav.primary {
  background-color: white;
  height: 100vh;
  overflow: hidden;
  transition: 0.48s;
  border-right: 1px solid #eee;
  width: 96px;
  position: sticky;
  top: 0;
  z-index: 1;
  display: grid;
  gap: 24px;
  align-content: start;
  padding: 24px;
  position: relative;
  > header, > section:nth-last-of-type(n+2) {
    border-bottom: 1px solid #eee;
    padding-bottom: 21px;
  }
  > header {
    display: flex;
    align-items: center;
    gap: 12px;
    img {
      width: 48px;
      height: 48px;
    }
    span {
      display: none;
      font-size: 21px;
      font-weight: 500;
    }
  }
  > section {
    display: grid;
    gap: 12px;
    > header {
      overflow: hidden;
      h3 {
        font-weight: 500;
        text-transform: uppercase;
        color: rgb(50, 50, 50);
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
      }
    }
  }
  > footer {
    display: grid;
    gap: 6px;
    position: absolute;
    background-color: rgba($color_primary, 0.06);
    border: 1px solid rgba($color_primary, 0.12);
    bottom: 0;
    right: 18px;
    left: 18px;
    bottom: 18px;
    border-radius: 12px;
    padding: 0;
    > span {
      display: none;
      &:nth-of-type(1) {
        font-size: 21px;
      }
      &:nth-of-type(2) {
        font-size: 13px;
      }
    }
    > button {
      background-color: $color_primary;
      &:nth-of-type(1) {
        display: none;
        padding: 9px 12px;
        border-radius: 4px;
        color: white;
        margin-top: 9px;
      }
      &:nth-of-type(2) {
        padding: 12px;
        border-radius: 9px;
        svg {
          fill: white;
        }
      }
    }
  }
  .links {
    display: grid;
    gap: 4px;
    li {
      display: flex;
      align-items: center;
      gap: 12px;
      .link {
        display: flex;
        gap: 12px;
        border-radius: 6px;
        transition: 0.12s;
        align-items: center;
        border: 1px solid transparent;
        padding: 8px 15px 8px 12px;
        svg {
          width: 21px;
          height: 21px;
        }
        span {
          color: black;
          font-size: 14px;
          text-wrap: nowrap;
          text-overflow: ellipsis;
          overflow-x: hidden;
          display: none;
          max-width: 100px;
        }
        &:hover {
          svg {
            fill: $color_primary;
          }
          span {
            color: $color_primary;
          }
        }
        &.router-link-active {
          background-color: rgba($color_primary, 0.04);
          border: 1px solid rgba($color_primary, 0.1);
          svg {
            fill: $color_primary;
          }
          span {
            color: $color_primary;
          }
        }
      }
      .button {
        margin-left: auto;
        display: none;
        svg {
          fill: #aaa;
        }
        &:hover {
          svg {
            fill: $color_primary;
          }
        }
        &.router-link-exact-active {
          svg {
            fill: $color_primary;
          }
        }
      }
    }
  }
  &.enabled {
    width: 240px;
    > header {
      span {
        display: block;
      }
    }
    > section {
      > header {
        h3 {
          text-align: start;
          padding: 0;
        }
      }
    }
    > footer {
      padding: 18px;
      right: 12px;
      left: 12px;
      bottom: 12px;
      > span {
        display: block
      }
      > button {
        &:nth-of-type(1) {
          display: block;
        }
        &:nth-of-type(2) {
          display: none;
        }
      }
    }
    .links {
      li {
        span {
          display: block;
        }
        .button {
          display: grid;
        }
      }
    }
  }
}
</style>
