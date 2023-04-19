<template>
  <div>
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
        <!--<b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="my-table"
          :value="change"
        >
        </b-pagination>-->
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
      <ul>
        <li>Statut: {{ this.form.statut }}</li>
        <li>Numéro: {{ this.form.numero }}</li>
        <li>Commandée le : {{ this.form.dateCommande }}</li>
        <li>Nom client: {{ this.form.nomClient }}</li>
        <li>prénom client: {{ this.form.prenomClient }}</li>
      </ul>
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

export default {
  name: "Acceuil",
  mounted() {
    this.listCommands();
  },
  data() {
    return {
      totalRows: 0,
      items: [],
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
          key: "actions",
          label: "Actions",
        },
      ],
      totalRows: 0,
      currentPage: 0,
      perPage: 5,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
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
    form_validation_num() {
      var res =
        this.form.numero.match(/[a-zA-Z]{2}\d{12}/gm) !== null &&
        this.form.numero.length <= 14
          ? true
          : false;
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
      if (item !== undefined) {
        this.getOneCommande(item.numero);
        this.$refs.commande.show();
      }
    },
    effacer(item, index, target) {},
    listCommands() {
      axios
        .get("commande/all")
        .then((response) => (this.items = response.data))
        .catch((error) => this.makeToast(error, "Erreur"));
      this.totalRows = this.items.length;
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
          this.makeToast(response, "Ajout/modification OK");
          this.listCommands();
        })
        .catch((error) => this.makeToast(error, "Erreur Ajout/modification"));
      console.log(data);
    },
    async delete() {
      const { data } = await axios
        .post("commande/delete/", this.form)
        .then((response) => {
          this.makeToast(response, "delete OK");
          this.listCommands();
        })
        .catch((error) => this.makeToast(error, "Erreur Ajout/modification"));
      console.log(data);
    },
    onFiltered() {},
    enregistrer() {
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
      this.form_validation_num();
      //this.submittedNames.push(this.name);
      this.getAddCommande();
      // Hide the modal manually
      this.$nextTick(() => {
        this.$refs.commande.hide();
      });
    },
  },
  components: { ValidationObserver, ValidationProvider },
};
</script>
