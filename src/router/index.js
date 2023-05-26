import Vue from 'vue'
import VueRouter from 'vue-router'
import Acceuil from '../views/Accueil'
import Commande from '../views/Commande.vue'
import LigneDeCommande from '../views/LigneDeCommande.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/accueil',
    name: 'accueil',
    component: Acceuil
  },
  {
    path: '/commande',
    name: 'commande',
    component: Commande 
  },
  {
    path: '/ligne',
    name: 'ligne',
    component: LigneDeCommande 
  },
  {
    path: '/',
    name: 'acceuil',
    component: Acceuil 
  },
  {
    path: '/commande/:target',
    name: 'fetch',
    component: Commande
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
