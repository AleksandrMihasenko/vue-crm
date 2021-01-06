<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{ info.bill | currency("RUB") }}</h4>
    </div>

    <Loader v-if="loading"></Loader>

    <p v-else-if="!categories.length" class="center">
      Категорий нет.
      <router-link to="/categories">Добавить категорию</router-link>
    </p>

    <section v-else>
      <div v-for="category of categories" v-bind:key="category.id">
        <p>
          <strong>{{ category.title }}:</strong>
          {{ category.spend | currency }} из {{ category.limit |currency }}
        </p>
        <div class="progress" >
          <div
            class="determinate"
            v-bind:class="[category.progressColor]"
            v-bind:style="{width: category.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Planning",
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(["info"])
  },
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    const cats = await this.$store.dispatch("fetchCategories");

    this.categories = cats.map(cat => {
      const spend = records
        .filter(record => record.categoryId === cat.id)
        .filter(record => record.type === "outcome")
        .reduce((total, record) => {
          return total += +record.amount;
        }, 0)

      const percent = (100 * spend / cat.limit);
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor = percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend
      }
    });

    this.loading = false;
  }
};
</script>

<style>

</style>
