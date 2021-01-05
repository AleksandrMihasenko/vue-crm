<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

    <Loader v-if="loading"></Loader>

    <p v-else-if="!categories.length" class="center">
      Категорий нет.
      <router-link to="/categories">Добавить категорию</router-link>
    </p>

    <form v-else class="form">
      <div class="input-field" >
        <select ref="select" v-model="category">
          <option v-for="category of categories" v-bind:key="category.id" v-bind:value="category.id">{{ category.title }}</option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input class="with-gap" name="type" type="radio" value="income" />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input class="with-gap" name="type" type="radio" value="outcome" />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
        >
        <label for="amount">Сумма</label>
        <span class="helper-text invalid">amount пароль</span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
        >
        <label for="description">Описание</label>
        <span
          class="helper-text invalid">description пароль</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Record",
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories) {
      this.category = this.categories[0].id;
    }

    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  }
};
</script>

<style>

</style>
