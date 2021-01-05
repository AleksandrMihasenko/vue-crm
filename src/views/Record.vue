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

    <form v-else class="form" v-on:submit.prevent="handleSubmit">
      <div class="input-field" >
        <select ref="select" v-model="category">
          <option v-for="category of categories" v-bind:key="category.id" v-bind:value="category.id">{{ category.title }}</option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input v-model="type" class="with-gap" name="type" type="radio" value="income" />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input v-model="type" class="with-gap" name="type" type="radio" value="outcome" />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input v-model.number="amount" id="amount" type="number" v-bind:class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }" />
        <label for="amount">Сумма</label>
        <span v-if="$v.amount.$dirty && !$v.amount.minValue" class="helper-text invalid">Минимальная значение {{ $v.amount.$params.minValue.min }}</span>
      </div>

      <div class="input-field">
        <input v-model="description" id="description" type="text" v-bind:class="{ invalid: $v.description.$dirty && !$v.description.required }" />
        <label for="description">Описание</label>
        <span v-if="$v.description.$dirty && !$v.description.required" class="helper-text invalid" >Введите описание</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { minValue, required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  name: "Record",
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: "outcome",
    amount: 1,
    description: ""
  }),
  validations: {
    amount: { minValue: minValue(1) },
    description: { required }
  },
  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch("createRecord", {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            data: new Date().toJSON()
          });
          const bill = this.type === "income" ? this.info.bill + this.amount : this.info.bill - this.amount;
          await this.$store.dispatch("updateInfo", { bill });
          this.$message("Запись создана");
          this.$v.$reset();
          this.amount = 1;
          this.description = "";
        } catch (error) {
          console.log(error);
        }
      } else {
        this.$message(`Недостаточно средств на счете (${this.amount - this.info.bill})`);
      }
    }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.amount;
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories) {
      this.category = this.categories[0].id;
    }

    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
      // eslint-disable-next-line no-undef
      M.updateTextFields();
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
