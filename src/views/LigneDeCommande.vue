<template>
  <div>
    <b-modal ref="ligneModal" size="xl" ok-only>
      <b-table :items="lignes" fields="">
        <template #cell(layout)="row">
          <ligne-commande-item :produit="row.item" />
        </template>
        <!--<template #cell(action)="row">

        </template>-->
      </b-table>
    </b-modal>
  </div>
</template>

<script>

export default {
  name: "ligne-de-commande",
  data() {
    mode: "";
  },
  methods: {},
};
</script>
