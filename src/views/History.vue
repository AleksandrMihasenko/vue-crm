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
      <HistoryTable v-bind:records="items"></HistoryTable>

      <Paginate
        v-model="page"
        v-bind:pageCount="pageCount"
        v-bind:clickHandler="pageChangeHandler"
        v-bind:prevText="'Назад'"
        v-bind:nextText="'Вперед'"
        v-bind:containerClass="'pagination'"
        v-bind:page-class="'waves-effect'"
      ></Paginate>
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";
import paginationMixin from "@/mixins/pagination.mixin";

export default {
name: "history",
  mixins:  [ paginationMixin ],
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.setupPagination(this.records.map(record => {
      return {
        ...record,
        categoryName: categories.find(cat => cat.id === record.categoryId).title,
        typeClass: record.type === "income" ? "green" : "red",
        typeText: record.type === "income" ? "Доход" : "Расход",
      }
    }));

    this.loading = false;
  },
  components: { HistoryTable }
}
</script>

<style>

</style>
