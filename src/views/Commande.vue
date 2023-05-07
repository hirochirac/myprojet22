<template>
  <div>
    <b-row>
      <b-table
        ref="formulaire"
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
        <template #cell(produit)="row">
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            variant="warning"
            class="mr-1"
          >
            Produits
          </b-button>
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
    </b-row>
    <b-row>
      <b-button variant="success" @click="enregistrer"
        >Nouvelle commande</b-button
      >
    </b-row>

    <b-modal
      id="info"
      ref="information"
      title="Information"
      @show="resetModal"
      @hidden="resetModal"
    >
      <b-row>
        <b-col>Statut:</b-col><b-col>{{ form.statut }}</b-col>
      </b-row>
      <b-row>
        <b-col>Numéro:</b-col><b-col>{{ form.numero }}</b-col>
      </b-row>
      <b-row>
        <b-col>Commandée le :</b-col><b-col>{{ form.dateCommande }}</b-col>
      </b-row>
      <b-row>
        <b-col>Nom client:</b-col><b-col>{{ form.nomClient }}</b-col>
      </b-row>
      <b-row>
        <b-col>prénom client:</b-col><b-row>{{ form.prenomClient }}</b-row>
      </b-row>
      <b-row v-for="p in form.ligneCommandes" :key="p.id">
        <b-col>{{ p.produit }}</b-col
        ><b-col>{{ p.prix }}*{{ p.quantite }}</b-col
        ><b-col>{{ p.prix * p.quantite }}</b-col>
      </b-row>
      {{ this.getTotalCommande(form.numero) }}
      <b-row>
        <b-col>Total</b-col>
        <b-col></b-col>
        <b-col>{{ total }}</b-col>
      </b-row>
    </b-modal>

    <b-modal
      id="commande"
      ref="commande"
      title="Enregister/Modifier commande"
      @show="resetModal"
      @ok="handleSubmit"
    >
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-row>
          <b-form-group label="Statut" label-for="Statut">
            <b-form-radio-group
              id="statut"
              name="statut"
              v-model="form.statut"
              required
            >
              <b-form-radio value="ENPREPARATION">Préparation</b-form-radio>
              <b-form-radio value="EXPEDIEE">Expédiée</b-form-radio>
              <b-form-radio value="LIVREE">Livrée</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group label="Date de commande" label-for="Date de commande">
            <b-form-input
              id="date_commande"
              name="date_commande"
              type="date"
              v-model="form.dateCommande"
              required
            ></b-form-input>
          </b-form-group>
          <label class="mt-3" for="datepicker-dateformat2"
            >Short date format</label
          >
          <b-form-datepicker
            id="datepicker-dateformat2"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: '2-digit',
            }"
            locale="fr"
          ></b-form-datepicker>
        </b-form-row>

        <b-form-row>
          <b-form-group
            label="Numéro de commande"
            label-for="Numéro de commande"
          >
            <b-form-input
              id="numero"
              name="numero"
              v-model="form.numero"
              required
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group label="Nom client" label-for="Nom client">
            <b-form-input
              id="nom_client"
              name="nom_client"
              v-model="form.nomClient"
              type="text"
              maxlength="100"
              required
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group label="Prénom client" label-for="Prénom client">
            <b-form-input
              id="prenom_client"
              name="prenom_client"
              type="text"
              v-model="form.prenomClient"
              maxlength="50"
              required
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group label="adresse livraison" label-for="adresse livraison">
            <b-form-input
              id="adresse_livaison"
              name="adresse_livaison"
              type="text"
              maxlength="100"
              v-model="form.adresseLivraison1"
              required
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group
            label="adresse complément"
            label-for="adresse complément"
          >
            <b-form-input
              id="adresse_complement"
              name="adresse_complement"
              maxlength="100"
              v-model="form.adresseLivraison2"
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group label="ville livraison" label-for="ville livraison">
            <b-form-input
              id="ville"
              name="ville_livraison"
              v-model="form.ville"
              maxlength="50"
              required
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group label="code postal" label-for="code postal">
            <b-form-input
              id="code_postal"
              name="code_postal"
              type="number"
              maxlength="5"
              v-model="form.codePostal"
              required
            ></b-form-input>
          </b-form-group>
        </b-form-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import axiosVue from "axios-vue";

export default {
  name: "Acceuil",
  mounted() {
    this.getPage();
  },
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
          key: "numero",
          label: "Numero",
        },
        {
          key: "nomClient",
          label: "Nom du client",
        },
        {
          key: "prenomClient",
          label: "Prenom du client",
        },
        {
          key: "produit",
          label: "Produits",
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
      form: {
        id: -1,
        dateCommande: new Date(),
        statut: "",
        numero: "",
        nomClient: "",
        prenomClient: "",
        adresseLivraison1: "",
        adresseLivraison2: "",
        ville: "",
        codePostal: "",
      },
    };
  },
  methods: {
    async getTotalCommande(numero) {
      await axios
        .get(`commande/total/${numero}`)
        .then((response) => {
          if (numero !== undefined) {
            this.total = response.data;
          } else {
            this.total = 0;
          }
        })
        .catch((error) => this.makeToast(error, "Erreur"));
    },
    async getPage() {
      await axios
        .get("commande/page")
        .then((response) => (this.pages = response.data))
        .catch((error) => this.makeToast(error, "Erreur"));
      this.totalRows = this.pages.totalElements;
      this.items = this.pages.content;
    },
    async listAllPages() {
      await axios
        .get("commande/pages")
        .then((response) => (this.items = response.data))
        .catch((error) => this.makeToast(error, "Erreur"));
    },
    form_validation_num() {
      var res =
        this.form.numero.match(/[a-zA-Z]{2}\d{12}/gm) !== null ? true : false;
      return res;
    },
    makeToast(message, titre) {
      this.$bvToast.toast(`${message}`, {
        title: titre,
        variant: "danger",
        autoHideDelay: 10000,
        solid: true,
      });
    },
    info(item, index, target) {
      if (item !== undefined) {
        this.getOneCommande(item.numero);
        this.$refs.information.show();
      }
    },
    modifier(item, index, target) {
      this.mode = "modif";
      this.getOneCommande(item.numero);
      this.$refs.commande.show();
    },
    effacer(item, index, target) {
      this.delete(item.id);
    },
    async listCommands() {
      await axios
        .get("commande/all")
        .then((response) => (this.items = response.data))
        .catch((error) => this.makeToast(error, "Erreur"));
    },
    async getOneCommande(num) {
      if (num !== undefined) {
        await axios
          .get(`commande/one/${num}`)
          .then((response) => (this.form = response.data))
          .catch((error) => this.makeToast(error, "Erreur"));
      }
    },
    async getAddCommande() {
      const { data } = await axios
        .post("commande/save/", this.form)
        .then((response) => {
          this.listCommands();
          this.makeToast(response, "OK");
        })
        .catch((error) => this.makeToast(error, "Erreur"));
    },
    async getModifCommande() {
      const { data } = await axios
        .put("commande/update/", this.form)
        .then((response) => {
          this.listCommands();
          this.makeToast(response, "OK");
        })
        .catch((error) => this.makeToast(error, "Erreur"));
    },
    async delete(id) {
      const { data } = await axios
        .delete(`commande/delete/${this.form.numero}`)
        .then((response) => {
          this.form = {};
          this.makeToast(response, "delete OK");
          this.listCommands();
        })
        .catch((error) => this.makeToast(error, ""));
    },
    onFiltered() {},
    enregistrer() {
      this.mode = "ajout";
      this.$refs.commande.show();
    },
    resetModal() {
      this.form = {};
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      //this.submittedNames.push(this.name);

      if (this.mode === "ajout") {
        this.getAddCommande();
      } else if (this.mode === "modif") {
        this.getModifCommande();
        this.mode = "ajout";
      }

      // Hide the modal manually
      this.$nextTick(() => {
        this.$refs.commande.hide();
      });
    },
  },
};
</script>
