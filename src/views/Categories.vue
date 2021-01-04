<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <Loader v-if="loading"></Loader>
      <div v-else class="row">
        <CategoryCreate v-on:created="addNewCategory"></CategoryCreate>
        <CategoryEdit v-if="categories.length" v-bind:categories="categories" v-on:updated="updateCategories" v-bind:key="categories.length + updateCount"></CategoryEdit>
        <p v-else class="center">Категорий нет</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "@/components/CategoryCreate";
import CategoryEdit from "@/components/CategoryEdit";

export default {
  name: "categories",
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;
  },
  components: {
    CategoryCreate, CategoryEdit
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategories(category) {
      const index = this.categories.findIndex(cat => cat.id === category.id);
      this.categories[index].title = category.title;
      this.categories[index].limit = category.limit;
      this.updateCount++;
    }
  }
};
</script>
