<template>
  <div>
    <i-frame v-if="!loading" :src="url" />
  </div>
</template>
<script>
import iFrame from "@/components/iFrame/index";
import { getConfigKey } from "@/api/infra/config";
export default {
  name: "Druid",
  components: { iFrame },
  data() {
    return {
      url: process.env.VUE_APP_BASE_API + "/druid/index.html",
      loading: true,
    };
  },
  created() {
    getConfigKey("url.druid")
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          return;
        }
        this.url = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
