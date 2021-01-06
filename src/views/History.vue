<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <Loader v-if="loading"></Loader>

    <p v-else-if="!records.length" class="center">
      Записей пока нет
      <router-link to="/record">Добавьте запись</router-link>
    </p>

    <section v-else>
      <HistoryTable v-bind:records="records"></HistoryTable>
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";

export default {
name: "history",
  data: () => ({
    loading: true,
    records: [],
    categories: []
  }),
  async mounted() {
    // this.records = await this.$store.dispatch("fetchRecords");
    const records = await this.$store.dispatch("fetchRecords");
    this.categories = await this.$store.dispatch("fetchCategories");

    this.records = records.map(record => {
      return {
        ...record,
        categoryName: this.categories.find(cat => cat.id === record.categoryId).title,
        typeClass: record.type === "income" ? "green" : "red",
        typeText: record.type === "income" ? "Доход" : "Расход",
      }
    });

    this.loading = false;
  },
  components: { HistoryTable }
}
</script>

<style>

</style>
