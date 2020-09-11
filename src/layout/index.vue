<template>
  <div class="home">
      <Nav/>
      <SliderBar/>
      <AppMain/>
  </div>
</template>

<script>
import Nav from './components/Nav';
import SliderBar from './components/SliderBar/SliderBar';
import AppMain from './components/AppMain';

export default {
  name: 'Layout',
   data() {
    return {
    }
  },
  components: {
      Nav,
      SliderBar,
      AppMain,
  },
  computed: {
  },
  methods: {
  }
}
</script>
