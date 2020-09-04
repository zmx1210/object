<template>
  <div class="home">
      <Nav/>
      <SliderBar/>
  </div>
</template>

<script>
import Nav from './components/Nav';
import SliderBar from './components/SliderBar/SliderBar'

export default {
  name: 'Layout',
   data() {
    return {
    }
  },
  components: {
      Nav,
      SliderBar,
  },
  computed: {
  },
  methods: {
  }
}
</script>
