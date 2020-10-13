<template>
  <div class="main">
    <div class="container">
        <div class="item1">1</div>
        <div class="item2">2</div>
        <div class="item3">3</div>
        <div class="item4">4</div>
        <div class="item5">5</div>
        <div class="item6">6</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'grid',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main {
  padding: 10px;

  .header {
    font-size: 20px;
  }

  .container {
      width: 400px;
      height: 400px;
      border: 1px solid #fef;
      display: grid;
      grid-template-columns: 100px 100px 100px;
      grid-template-rows: 80px 80px 80px 80px;
      grid-row-gap: 10px;
      grid-column-gap: 10px;
      place-content: center;

      div {
          background: rosybrown;
      }
  }
}
</style>
