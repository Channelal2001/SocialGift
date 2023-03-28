import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import MainView from '../views/MainView.vue'
import ProfileView from '../views/ProfileView.vue'
import ChatView from '../views/ChatView.vue'
import EditarPerfilView from '../views/EditarPerfilView.vue'
import WishlistsView from '../views/WishlistsView.vue'
import CreateListView from '../views/CreateListView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/main',
      name: 'main',
      component: MainView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/editarperfil',
      name: 'editarperfil',
      component: EditarPerfilView
    },
    {
      path: '/wishlists',
      name: 'wishlists',
      component:WishlistsView
    },{
      path: '/createlist',
      name: 'createlist',
      component:CreateListView
    }
    
  ]
})

export default router
