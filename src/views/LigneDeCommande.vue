<template>
  <div>
    <b-table
        ref="ligne"
        :items="pages.content"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        stacked="md"
        show-empty
        small
        @filtered="onFiltered"
      >
      <template #cell(actions)="row">
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            variant="warning"
            class="mr-1"
          >
            Information
          </b-button>
          <b-button
            size="sm"
            @click="modifier(row.item, row.index, $event.target)"
            variant="primary"
            class="mr-1"
          >
            Modifier
          </b-button>
          <b-button
            size="sm"
            @click="effacer(row.item, row.index, $event.target)"
            variant="danger"
            class="mr-1"
          >
            Effacer
          </b-button>
        </template>
      </b-table>

      <b-row class="overflow-auto">
        <b-pagination
          ref="pagination"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="my-table"
          @click="loadPage"
        >
        </b-pagination>
    </b-row>
    <b-row>
      <b-button variant="success" @click="enregistrer"
        >Ajout de produit</b-button
      >
    </b-row>
  </div>
</template>

<script>
export default {
  name: "ligne-de-commande",
  data() {
    return {
      total: 0.0,
      mode: "ajout",
      totalRows: 0,
      fields: [
        {
          key: "id",
          label: "Id",
        },
        {
          key: "nomProduit",
          label: "Produit",
        },
        {
          key: "prix",
          label: "Prix",
        },
        {
          key: "quantite",
          label: "Quantite",
        },
        {
          key: "actions",
          label: "Actions",
        },
      ],
      pages: {},
      currentPage: 1,
      perPage: 7,
      pageOptions: [7, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "numero",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
    };
  },
  methods: {},
};
</script>
