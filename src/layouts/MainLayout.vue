<template>
  <Loader v-if="loading"></Loader>
  <div v-else>
    <div class="app-main-layout">
      <Navbar v-on:click="isOpen = !isOpen"></Navbar>
      <Sidebar v-model="isOpen" v-bind:key="locale"></Sidebar>
      <main class="app-content" v-bind:class="{ full: !isOpen }">
        <div class="app-page">
          <router-view></router-view>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large blue" to="/record" v-tooltip="'Создать новую запись'">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import messages from "@/utils/messages";

export default {
  name: "main-layout",
  data: () => ({
    isOpen: true,
    loading: true
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo');
    }
    this.loading = false;
  },
  components: {
    Navbar,
    Sidebar
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    locale() {
      return this.$store.getters.info.locale;
    }
  },
  watch: {
    // locale() {
    //   console.log("update menu");
    // },
    error(fbError) {
      this.$error(messages[fbError.code] || "Попробуйте еще раз");
    }
  }
};
</script>
