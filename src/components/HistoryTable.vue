<template>
  <table>
    <thead>
    <tr>
      <th>#</th>
      <th>Сумма</th>
      <th>Дата</th>
      <th>Категория</th>
      <th>Тип</th>
      <th>Открыть</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(record, index) of records" v-bind:key="record.id">
      <td>{{ index + 1 }}</td>
      <td>{{ record.amount | currency("RUB") }}</td>
      <td>{{ record.date }}</td>
      <td>{{ record.categoryName }}</td>
      <td>
        <span v-bind:class="[record.typeClass]" class="white-text badge">{{ record.typeText }}</span>
      </td>
      <td>
        <button v-tooltip="'Посмотреть запись'" v-on:click="$router.push('/detail/' + record.id)" class="btn-small btn">
          <i class="material-icons">open_in_new</i>
        </button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "HistoryTable",
  props: {
    records: {
      required: true,
      type: Array
    }
  }
}
</script>

<style>

</style>
