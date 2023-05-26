<template>
  <div>
    <b-row>
      <b-form-group
        label="Filter"
        label-for="filter-input"
        label-cols-sm="3"
        label-align-sm="right"
        label-size="sm"
        class="mb-0"
      >
        <b-input-group size="sm">
          <b-form-input
            id="filter-input"
            v-model="filtre"
            type="search"
            placeholder="Type to Search"
            @change="filtering"
          ></b-form-input>

          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-row>
    <b-row>
      <b-table
        ref="formulaire"
        :items="items"
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
          @click="loadPage"
        >
        </b-pagination>
      </b-row>
    </b-row>
    {{ cible }}
    <b-row>
      <b-button variant="success" @click="add">Nouvelle commande</b-button>
    </b-row>
    <b-modal id="info" ref="information" title="Information" size="md" ok-only>
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
        <b-col>Nbre de jrs écoulés :</b-col><b-col>{{ orderDelay }}</b-col>
      </b-row>
      <b-row>
        <b-col>Nom client:</b-col><b-col>{{ form.nomClient }}</b-col>
      </b-row>
      <b-row>
        <b-table :items="form.ligneCommandes" :fields="infoFields" hover>
          <template #cell(total)="row">
            {{ row.item.prix * row.item.quantite }}
          </template>
          <template #foot(total)>
            <b>Total:{{ total }}</b
            ><br />
            <b>Moyenne:{{ moy }}</b>
          </template>
        </b-table>
        <b>Total:{{ total }}</b
        ><br />
        <b>Moyenne:{{ moy }}</b>
      </b-row>
    </b-modal>

    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <b-form ref="form" @submit.stop.prevent="handleSubmit(enregister)">
        <b-modal
          id="commande"
          ref="commande"
          :title="titre"
          @show="resetModal"
          ok-disabled
          cancel-disabled
        >
          <b-form-row>
            <b-form-group label="Statut" label-for="Statut">
              <ValidationProvider
                name="vstatut"
                v-slot="validationContext"
                :rules="{ required: true }"
              >
                <b-form-radio-group
                  id="statut"
                  name="statut"
                  v-model="form.statut"
                  :disabled="mode === 'del'"
                >
                  <b-form-radio value="PREPARATION">Préparation</b-form-radio>
                  <b-form-radio value="EXPEDIEE">Expédiée</b-form-radio>
                  <b-form-radio value="LIVREE">Livrée</b-form-radio>
                </b-form-radio-group>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group label="Date de commande" label-for="Date de commande">
              <ValidationProvider
                name="vdate"
                v-slot="validationContext"
                :rules="{ required: true }"
              >
                <b-form-datepicker
                  id="datepicker-dateformat2"
                  v-model="form.dateCommande"
                  :date-format-options="{
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }"
                  locale="fr"
                  :disabled="mode === 'del'"
                ></b-form-datepicker>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group
              label="Numéro de commande"
              label-for="Numéro de commande"
            >
              <ValidationProvider
                name="vnumero"
                v-slot="validationContext"
                :rules="{ required: true, max: 14, regex: /^[A-Z]{2}\w{12}$/ }"
              >
                <b-form-input
                  id="numero"
                  name="numero"
                  v-model="form.numero"
                  required
                  :disabled="mode === 'del' || mode === 'modif'"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group label="Nom client" label-for="Nom client">
              <ValidationProvider
                name="nomclient"
                v-slot="validationContext"
                :rules="{
                  required: true,
                  alpha_spaces: true,
                  min: 3,
                  max: 100,
                }"
              >
                <b-form-input
                  id="nom_client"
                  name="nom_client"
                  v-model="form.nomClient"
                  type="text"
                  maxlength="100"
                  required
                  :disabled="mode === 'del'"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group label="email" label-for="adresse livraison">
              <ValidationProvider
                name="email"
                v-slot="validationContext"
                :rules="{ required: true, email: true }"
              >
                <b-form-input
                  id="adresse_livaison"
                  name="adresse_livaison"
                  type="text"
                  maxlength="100"
                  v-model="form.email"
                  :disabled="mode === 'del'"
                  required
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group
              label="adresse livraison"
              label-for="adresse livraison"
            >
              <ValidationProvider
                name="adresse1"
                v-slot="validationContext"
                :rules="{
                  required: true,
                  alpha_spaces: true,
                  min: 10,
                  max: 200,
                }"
              >
                <b-form-input
                  id="adresse_livaison"
                  name="adresse_livaison"
                  type="text"
                  maxlength="100"
                  v-model="form.adresseLivraison1"
                  :disabled="mode === 'del'"
                  required
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group
              label="adresse complément"
              label-for="adresse complément"
            >
              <ValidationProvider
                name="adresse1"
                v-slot="validationContext"
                :rules="{
                  required: true,
                  alpha_spaces: true,
                  min: 10,
                  max: 200,
                }"
              >
                <b-form-input
                  id="adresse_complement"
                  name="adresse_complement"
                  maxlength="100"
                  v-model="form.adresseLivraison2"
                  :disabled="mode === 'del'"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group label="ville livraison" label-for="ville livraison">
              <ValidationProvider
                name="adresse1"
                v-slot="validationContext"
                :rules="{
                  required: true,
                  alpha_spaces: true,
                  min: 10,
                  max: 200,
                }"
              >
                <b-form-input
                  id="ville"
                  name="ville_livraison"
                  v-model="form.villeLivraison"
                  maxlength="50"
                  required
                  :disabled="mode === 'del'"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>

          <b-form-row>
            <b-form-group label="code postal" label-for="code postal">
              <ValidationProvider
                name="adresse1"
                v-slot="validationContext"
                :rules="{ required: true, integer: true, min: 5, max: 5 }"
              >
                <b-form-input
                  id="code_postal"
                  name="code_postal"
                  type="number"
                  maxlength="5"
                  v-model="form.codePostal"
                  :disabled="mode === 'del'"
                ></b-form-input>
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                  validationContext.errors[0]
                }}</b-form-invalid-feedback>
              </ValidationProvider>
            </b-form-group>
          </b-form-row>
          <template #modal-footer>
            <b-button-group>
              <b-button type="submit" variant="warning" @click="enregister">{{
                mode
              }}</b-button>
              <b-button variant="secondary" @click="annuler">Annuler</b-button>
            </b-button-group>
          </template>
        </b-modal>
      </b-form>
    </ValidationObserver>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { regex } from "vee-validate/dist/rules";

export default {
  name: "commande",
  mounted() {
    this.getPage();
  },
  watch: {
    "$route.params": function (params) {
      this.cible = params.target;
      console.log(this.cible);
      if (this.cible !== undefined) {
        this.getCible();
      }
    },
  },
  data() {
    return {
      cible: undefined,
      filtre: "",
      deleteOk: false,
      produits: [],
      total: 0,
      moy: 0,
      mode: "ajout",
      totalRows: 0,
      titre: "Ajouter commande",
      orderDelay: 0,
      infoFields: [
        {
          key: "id",
          label: "Id",
        },
        {
          key: "produit",
          label: "Nom du produit",
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
          key: "total",
          label: "total",
        },
      ],
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
          key: "actions",
          label: "Actions",
        },
      ],
      pages: {},
      currentPage: 1,
      perPage: 7,
      pageOptions: [7, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "numero",
      sortDesc: true,
      sortDirection: "asc",
      filter: null,
      filterOn: ["numero", "nomClient"],
      form: {
        id: -1,
        dateCommande: new Date(),
        statut: "",
        numero: "",
        nomClient: "",
        email: " ",
        prenomClient: "",
        adresseLivraison1: "",
        adresseLivraison2: "",
        ville: "",
        codePostal: "",
        ligneCommandes: [],
      },
    };
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async filtering() {
      await axios.get(``).then().catch();
    },
    async getProduitCommande(numero) {
      await axios
        .get(`commande/produit/${numero}`)
        .then((response) => (this.form.ligneCommandes = response.data))
        .catch((error) => this.makeToast("Liste des produits vide", "Erreur"));
    },
    async getMoyCommande(numero) {
      await axios
        .get(`commande/moy/${numero}`)
        .then((result) => (this.moy = result.data))
        .catch((error) =>
          this.makeToast("Imposible de calculer une moyenne", "Erreur")
        );
    },
    async getTotalCommande(numero) {
      let res = {};
      if (numero !== undefined || numero !== "") {
        res = await axios
          .get(`commande/total/${numero}`)
          .then((response) => {
            this.total = response.data;
          })
          .catch((error) => this.makeToast(error, "Erreur"));
      } else {
        this.total = 0;
      }
    },
    async loadPage() {
      await axios
        .get(
          `commande/pages?pageNo=${this.currentPage}&pageSize=${this.perPage}`
        )
        .then((response) => {
          this.pages = response.data;
        })
        .catch((error) => this.makeToast(error, "Erreur"));
      this.totalRows = this.pages.totalElements;
      this.items = this.pages.content;
    },
    async getCible() {
      console.log("debut");
      await axios
        .get(`commande/fetch/${this.cible}`)
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => this.makeToast(error, "Erreur"));
      this.cible = undefined;
      console.log("fin");
    },
    async getPage() {
      await axios
        .get("commande/page")
        .then((response) => {
          this.pages = response.data;
          this.items = this.pages.content;
        })
        .catch((error) => this.makeToast(error, "Erreur"));
      this.totalRows = this.pages.totalElements;
    },
    makeToast(message, titre, variant = "danger") {
      this.$bvToast.toast(`${message}`, {
        title: titre,
        variant: variant,
        autoHideDelay: 10000,
        solid: true,
      });
    },
    info(item, index, target) {
      this.form = item;
      this.titre = "Information sur commande";
      this.getProduitCommande(item.numero);
      this.getTotalCommande(item.numero);
      this.getMoyCommande(item.numero);
      this.getOrderDelay(item.numero);
      this.$refs.information.show();
    },
    modifier(item, index, target) {
      this.mode = "modif";
      this.getOneCommande(item.numero);
      this.titre = "Modifier commande";
      this.$refs.commande.show();
    },
    effacer(item, index, target) {
      this.mode = "del";
      this.titre = "Effacer commande";
      this.getOneCommande(item.numero);
      this.getProduitCommande(item.numero);
      this.$refs.commande.show();
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
          this.getPage();
          this.makeToast(response, "OK");
        })
        .catch((error) => this.makeToast(error, "Erreur"));
    },
    async getModifCommande() {
      const { data } = await axios
        .put("commande/update/", this.form)
        .then((response) => {
          this.getPage();
          this.makeToast(response, "OK");
        })
        .catch((error) => this.makeToast(error, "Erreur"));
    },
    async getDeleteCommande() {
      this.$bvModal
        .msgBoxConfirm("Confirmez la suppression.", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "oui",
          cancelTitle: "non",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          axios
            .delete(`commande/del/${this.form.id}`)
            .then((response) => {
              this.getPage();
              this.makeToast(response, "delete OK");
            })
            .catch((error) => this.makeToast(error, "delete KO"));
        })
        .catch((error) => this.makeToast(response, "Suppression annulée"));
    },
    async getOrderDelay(numero) {
      if (numero !== undefined) {
        const { data } = await axios
          .get(`commande/delay/${numero}`)
          .then((response) => (this.orderDelay = response.data))
          .catch((error) => this.makeToast(error, "getOrderDelay KO"));
      }
    },
    onFiltered() {},
    add() {
      this.mode = "ajout";
      this.titre = "Ajouter commande";
      this.$refs.commande.show();
    },
    resetModal() {
      this.form = {};
    },
    annuler() {
      this.resetModal();
      this.$refs.commande.hide();
    },
    enregister() {
      if (this.mode === "ajout") {
        this.getAddCommande();
      } else if (this.mode === "modif") {
        this.getModifCommande();
      } else if (this.mode === "del") {
        this.getDeleteCommande();
      }
      this.$refs.commande.hide();
      this.$nextTick(() => {
        this.$refs.form.hide();
      });
      console.log("fin");
    },
  },
  components: { ValidationObserver, ValidationProvider },
};
</script>
