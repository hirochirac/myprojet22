<template>
  <b-jumbotron>
    <h1 class="display-4 col-md-10">Hello, world!</h1>
    <p class="lead">
      This is a simple hero unit, a simple jumbotron-style component for calling
      extra attention to featured content or information.
    </p>
    <p class="col-md-10">
      It uses utility classes for typography and spacing to space content out
      within the larger container.
    </p>
    <p class="lead col-md-10">
      <b-link class="btn btn-primary btn-lg" role="button" to="commande"
        >Commandes</b-link
      >
      <b-link class="btn btn-primary btn-lg" role="button" to="ligne"
        >Ligne de commandes</b-link
      >
    </p>
  </b-jumbotron>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Acceuil",
  components: {},
};
</script>