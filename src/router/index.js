import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Pages principales
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Courses from '@/views/Courses.vue'
import ConversationClub from '@/views/ConversationClub.vue'
import GrammarWorkshops from '@/views/GrammarWorkshops.vue'
import LevelTest from '@/views/LevelTest.vue'
import LevelEvaluation from '@/views/LevelEvaluation.vue'
import Profile from '@/views/Profile.vue'
import Subscription from '@/views/Subscription.vue'
import Admin from '@/views/Admin.vue'

// Pages d'authentification
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'

// Pages de cours spécifiques
import CourseDetail from '@/views/courses/CourseDetail.vue'
import LessonView from '@/views/courses/LessonView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true, auth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { public: true, auth: false }
  },
  {
    path: '/test-niveau',
    name: 'LevelTest',
    component: LevelTest,
    meta: { public: true }
  },
  {
    path: '/evaluations',
    name: 'LevelEvaluation',
    component: LevelEvaluation,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/cours',
    name: 'Courses',
    component: Courses,
    meta: { requiresAuth: true }
  },
  {
    path: '/cours/:id',
    name: 'CourseDetail',
    component: CourseDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/lecon/:courseId/:lessonId',
    name: 'LessonView',
    component: LessonView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/club-conversation',
    name: 'ConversationClub',
    component: ConversationClub,
    meta: { requiresAuth: true }
  },
  {
    path: '/ateliers-grammaire',
    name: 'GrammarWorkshops',
    component: GrammarWorkshops,
    meta: { requiresAuth: true }
  },
  {
    path: '/profil',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/abonnement',
    name: 'Subscription',
    component: Subscription,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Guards de navigation
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Vérifier si l'utilisateur est connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Rediriger les utilisateurs connectés loin des pages d'auth
  if (to.meta.auth === false && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  // Vérifier les permissions admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router 