<script setup lang="ts">
import { Question } from '~/src/modules/question/domain/model';
import type { StudentQuestion } from '~/src/modules/student_question/domain/model';

interface IProps {
  question: Question,
  student_question?: StudentQuestion,
}

const props = defineProps<IProps>()
</script>

<template>
  <tr>
    <td class="elipsis">{{ props.question.question }}</td>
    <td>{{ props.question.type }}</td>
    <td>{{ props.question.points }}</td>
    <template v-if="props.student_question">
      <td>{{ props.student_question.points }}</td>
    </template>
    <slot></slot>
  </tr>
</template>
