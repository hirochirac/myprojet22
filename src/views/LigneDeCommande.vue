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
      <template #cell(numero)="row">
        {{ row.item.commande.numero }}
      </template>
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
    {{ pages.content }}
    <b-row class="overflow-auto">
      <b-pagination
        ref="pagination"
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        aria-controls="my-table"
      >
      </b-pagination>
    </b-row>
    <b-row>
      <b-button variant="success" @click="enregistrer"
        >Ajout de produit</b-button
      >
    </b-row>

    <b-modal ref="info" size="xl" :title="mode">
      <b-row>
        <b-col>Numero</b-col>
        <b-col>{{ infoNumero }}</b-col>
      </b-row>
      <b-row>
        <b-col>Produit</b-col>
        <b-col>{{ infoProduit }}</b-col>
      </b-row>
      <b-row>
        <b-col>Prix</b-col>
        <b-col>{{ infoPrix }}</b-col>
      </b-row>
      <b-row>
        <b-col>Quantite</b-col>
        <b-col>{{ infoQuantite }}</b-col>
      </b-row>
      <b-row>
        <b-col>Total</b-col>
        <b-col>{{ infoQuantite * infoPrix }}</b-col>
      </b-row>
    </b-modal>

    <b-form @submit.stop.prevent="handleSubmit">
      <b-modal ref="tablo" size="xl" :title="mode">
        <b-form-group label="Nom du produit" label-for="produit">
          <b-form-input
            v-model="form.produit"
            :min="3"
            :max="100"
            :disabled="mode == 'info' || mode == 'del'"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Prix" label-for="prix">
          <b-form-input v-model="form.prix" :min="1" :max="5"></b-form-input>
        </b-form-group>
        <b-form-group label="Quantité" label-for="quantité">
          <b-form-input
            v-model="form.quantite"
            :min="1"
            :max="5"
            :disabled="mode == 'info' || mode == 'del'"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Commande:" label-for="commande">
          <b-form-select
            v-model="commandeId"
            :options="commandes"
            value-field="numero"
            text-field="numero"
            :disabled="mode == 'modif' || mode == 'info' || mode == 'del'"
          >
            <template #first>
              <b-form-select-option :value="undefined" aria-selected="true"
                >Veuillez choisir une commande</b-form-select-option
              >
            </template>
          </b-form-select>
        </b-form-group>
        <template #modal-footer>
          <div v-if="mode !== 'info'">
            <b-button type="submit" variant="warning">{{ mode }}</b-button>
          </div>
          <b-button type="submit" variant="primary" @click="annuler"
            >Annuler</b-button
          >
        </template>
      </b-modal>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ligne-de-commande",
  mounted() {
    this.getPages();
    this.getAllCommande();
  },
  data() {
    return {
      total: 0.0,
      mode: "ajout",
      totalRows: 0,
      titre: "",
      commandeId: "",
      infoNumero: "",
      infoProduit: "",
      infoQuantite: 0,
      infoPrix: 0.0,
      form: {
        id: -1,
        produit: "",
        prix: 0.0,
        quantite: 0,
        commande: {},
      },
      fields: [
        {
          key: "id",
          label: "Id",
        },
        {
          key: "numero",
          label: "Numero",
        },
        {
          key: "produit",
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
      pageCommande: {},
      commandes: [],
      currentPage: 1,
      perPage: 7,
      pageOptions: [7, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "numero",
      sortDesc: true,
      sortDirection: "asc",
      filter: null,
      filterOn: ["nomProduit"],
    };
  },
  methods: {
    async getPages() {
      await axios
        .get(`ligne/all`)
        .then((reponse) => {
          this.pages = reponse.data;
        })
        .catch((error) => {
          this.makeToast("liste produit vide", "");
        });
    },
    async getAllCommande() {
      await axios
        .get(`commande/all`)
        .then((reponse) => {
          this.commandes = reponse.data;
        })
        .catch((error) => {
          this.makeToast("liste commande vide", "");
        });
    },
    annuler() {
      this.form = {};
      this.$refs.tablo.hide();
    },
    enregistrer() {
      this.mode = "ajout";
      this.$refs.tablo.show();
    },
    modifier(item, index, evt) {
      this.mode = "modif";
      if (this.commandeId !== undefined) {
        this.form = item;
        this.commandeId = item.commande.numero;
        this.$refs.tablo.show();
      }
      this.$refs.tablo.show();
    },
    effacer(item, index, evt) {
      this.mode = "del";
      this.form = item;
      this.commandeId = item.commande.numero;
      this.$refs.tablo.show();
    },
    info(item, index, evt) {
      this.mode = "info";
      this.infoNumero = item.commande.numero;
      this.infoProduit = item.produit;
      this.infoPrix = item.prix;
      this.infoQuantite = item.quantite;
      this.$refs.info.show();
    },
    async handleSubmit() {
      if (this.mode === "ajout") {
        await axios
          .post(`ligne/ajout/${commandeId}`, this.form)
          .then((response) => {
            this.getPages();
            this.$refs.ligne.refresh();
            this.$refs.tablo.hide();
            this.makeToast("Ajout d'un produit à une commande", "Réussite");
          })
          .catch((err) =>
            this.makeToast("Erreur ajout un produit à une commande", "Erreur")
          );
      } else if (this.mode === "modif") {
        await axios
          .put("ligne/modif/", this.form)
          .then((response) =>
            this.makeToast("Modif d'un produit à une commande", "Réussite")
          )
          .catch((err) =>
            this.makeToast("Erreur Modif un produit à une commande", "Erreur")
          );
      } else if (this.mode == "del") {
        await axios
          .delete(`ligne/ajout/${form.id}`)
          .then((response) =>
            this.makeToast("effacer un produit d'une commande", "Réussite")
          )
          .catch((err) =>
            this.makeToast("Erreur effacer un produit d'une commande", "Erreur")
          );
      }
    },
    onFiltered() {},
    makeToast(message, titre) {
      this.$bvToast.toast(`${message}`, {
        title: titre,
        variant: "danger",
        autoHideDelay: 10000,
        solid: true,
      });
    },
  },
};
</script>
