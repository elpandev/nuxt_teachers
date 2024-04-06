<script setup lang="ts">
  interface IProps {
    percent: number
    stroke_width: number
    size: number
    color: string
  }

  const canvas = ref<HTMLCanvasElement>()
  const props  = withDefaults(defineProps<IProps>(), { stroke_width: 9, color: 'black' })

  function degrees_to_radians(deg: number) {
    return (deg/180) * Math.PI;
  }

  function percent_to_radians(percentage: number) {
    const degrees = percentage * 360 / 100;
    return degrees_to_radians(degrees + 90);
  }

  onMounted(() => {
    const dx     = props.size
    const dy     = props.size
    const ctx    = canvas.value!.getContext('2d')!;
    const radius = (dx / 2) - (props.stroke_width / 2)

    ctx.beginPath();
    
    ctx.lineWidth   = props.stroke_width - 1;
    ctx.strokeStyle = '#eee'

    ctx.arc(dx/2, dy/2, radius, percent_to_radians(0), percent_to_radians(100));
    ctx.stroke();

    ctx.beginPath();

    ctx.lineWidth   = props.stroke_width;
    ctx.strokeStyle = props.color
    ctx.lineCap     = 'round'

    ctx.arc(dx/2, dy/2, radius, percent_to_radians(0), percent_to_radians(props.percent));
    ctx.stroke();
  })
</script>

<template>
  <canvas ref="canvas" width="100" height="100"></canvas>
</template>
