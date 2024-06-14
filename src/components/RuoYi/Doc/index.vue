<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: "YudaoDoc",
  data() {
    return {
      url: "https://atguigu.yuque.com/org-wiki-atguigu-fggbmk/vue2/vhwxt74g6qe4wdbr",
    };
  },
  methods: {
    goto() {
      window.open(this.url);
    },
  },
};
</script>
