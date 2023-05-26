<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand">Site</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <b-link class="nav-text nav-link" to="accueil">Accueil</b-link>
            </li>
            <li class="nav-item">
              <b-link class="nav-text nav-link" to="commande">Commandes</b-link>
            </li>
            <li class="nav-item">
              <b-link class="nav-text nav-link" to="ligne"
                >Lignes de commande</b-link
              >
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#">Something else here</a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled">Disabled</a>
            </li>
          </ul>
          <form class="d-flex" @submit.stop.prevent="chercher">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Chercher"
              aria-label="Chercher"
              v-model="target"
            />
            <button class="btn btn-primary" type="submit" :max="100">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  </header>
</template>


<script>
import axios from "axios";
export default {
  name: "menubar",
  data() {
    return {
      target: "",
    };
  },
  methods: {
    makeToast(message, titre) {
      this.$bvToast.toast(`${message}`, {
        title: titre,
        variant: "danger",
        autoHideDelay: 10000,
        solid: true,
      });
    },
    async getCommande() {
      await axios
        .get(`commande/fetch/${this.rechercher}`)
        .then((reponse) => {
          this.commande = reponse.data;
          this.pagesCommande.push(this.commande);
          this.getLigneCommande(this.commande.numero);
        })
        .catch((erreur) =>
          this.makeToast("Données " + this.rechercher + " non trouvée")
        );
    },
    async getLigneCommande(numero) {
      await axios
        .get(`commande/produit/${this.commande.numero}`)
        .then((reponse) => {
          this.pagesLigne = reponse.data;
        })
        .catch((erreur) =>
          this.makeToast("Données " + this.rechercher + " non trouvée")
        );
    },
    chercher() {
      this.$router.push({
        path: `/commande/${this.target}`,
      });
    },
  },
};
</script>