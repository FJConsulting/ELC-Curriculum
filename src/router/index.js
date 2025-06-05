import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin-supabase'

// Pages principales
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Courses from '@/views/Courses.vue'
import LevelTest from '@/views/LevelTest.vue'
import LevelEvaluation from '@/views/LevelEvaluation.vue'
import Profile from '@/views/Profile.vue'
import Subscription from '@/views/Subscription.vue'
import Admin from '@/views/Admin.vue'
import GenericCourseView from '@/views/GenericCourseView.vue'

// Pages d'authentification
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'

// Pages de cours spécifiques
import CourseDetail from '@/views/courses/CourseDetail.vue'
import LessonView from '@/views/courses/LessonView.vue'

// Routes statiques de base
const staticRoutes = [
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
    path: '/courses',
    name: 'Courses',
    component: Courses,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: CourseDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/lesson/:courseId/:lessonId',
    name: 'LessonView',
    component: LessonView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/subscription',
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

// Fonction pour générer les routes dynamiques basées sur les types de cours
function generateDynamicRoutes() {
  const adminStore = useAdminStore()
  const dynamicRoutes = []

  // Si les types de cours sont disponibles, créer des routes pour chacun
  if (adminStore.courseTypes && adminStore.courseTypes.length > 0) {
    adminStore.courseTypes.forEach(courseType => {
      if (courseType.route && courseType.route.startsWith('/')) {
        dynamicRoutes.push({
          path: courseType.route,
          name: courseType.slug || courseType.route.substring(1),
          component: GenericCourseView,
          meta: { requiresAuth: true, dynamic: true },
          props: true
        })
      }
    })
  } else {
    // Routes par défaut pour la rétrocompatibilité
    dynamicRoutes.push(
      {
        path: '/conversation-club',
        name: 'conversation-club',
        component: GenericCourseView,
        meta: { requiresAuth: true, dynamic: true }
      },
      {
        path: '/grammar-workshops',
        name: 'grammar-workshops',
        component: GenericCourseView,
        meta: { requiresAuth: true, dynamic: true }
      },
      {
        path: '/pronunciation',
        name: 'pronunciation',
        component: GenericCourseView,
        meta: { requiresAuth: true, dynamic: true }
      }
    )
  }

  return dynamicRoutes
}

// Créer le router avec seulement les routes statiques initialement
const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Fonction pour mettre à jour les routes dynamiquement
export function updateRoutes() {
  try {
    const dynamicRoutes = generateDynamicRoutes()
    
    // Supprimer les anciennes routes dynamiques
    router.getRoutes().forEach(route => {
      if (route.meta && route.meta.dynamic) {
        router.removeRoute(route.name)
      }
    })
    
    // Ajouter les nouvelles routes dynamiques
    dynamicRoutes.forEach(route => {
      try {
        router.addRoute(route)
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la route:', route.path, error)
      }
    })
    
    console.log('Routes dynamiques mises à jour:', dynamicRoutes.map(r => r.path))
  } catch (error) {
    console.error('Erreur lors de la mise à jour des routes:', error)
  }
}

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