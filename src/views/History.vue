<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
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
import { Pie } from "vue-chartjs";

export default {
name: "history",
  extends: Pie,
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

    this.renderChart({
      labels: categories.map(cat => cat.title),
      datasets: [{
        label: 'Расходы по категориям',
        data: categories.map(cat => {
          return this.records.reduce((total, record) => {
            if (record.categoryId === cat.id && record.type === "outcome") {
              total += +record.amount;
            }
            return total;
          }, 0)
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    });

    this.loading = false;
  },
  components: { HistoryTable }
}
</script>

<style>

</style>
